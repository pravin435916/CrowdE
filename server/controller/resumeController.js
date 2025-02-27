const resumeService = require('../services/resumeServices');
const linkedInService = require('../services/linkedinServices');

exports.parseResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const linkedInUrl = req.body.linkedInUrl;
    
    // Parse resume file
    const resumeData = await resumeService.parseResume(filePath);
    
    // Extract additional information from LinkedIn if URL provided
    let linkedInData = {};
    if (linkedInUrl && linkedInUrl.trim() !== '') {
      linkedInData = await linkedInService.scrapeLinkedInProfile(linkedInUrl);
    }
    
    // Merge data from both sources and extract skills
    const combinedData = {
      ...resumeData,
      ...linkedInData,
      skills: [
        ...(resumeData.skills || []),
        ...(linkedInData.skills || [])
      ].filter((skill, index, self) => 
        self.findIndex(s => s.toLowerCase() === skill.toLowerCase()) === index
      )
    };
    
    res.status(200).json({
      success: true,
      data: combinedData
    });
    
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume'
    });
  }
};