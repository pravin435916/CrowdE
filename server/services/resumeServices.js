const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const skillsExtractor = require('../utility/skillExtractor');

/**
 * Parse resume content based on file type
 */
exports.parseResume = async (filePath) => {
  const fileExt = path.extname(filePath).toLowerCase();
  let textContent = '';
  
  try {
    // Extract text based on file type
    if (fileExt === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      textContent = pdfData.text;
    } 
    else if (fileExt === '.docx' || fileExt === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    } 
    else {
      throw new Error('Unsupported file format');
    }
    
    // Extract information from text
    const extractedData = {
      name: extractName(textContent),
      email: extractEmail(textContent),
      phone: extractPhone(textContent),
      skills: skillsExtractor.extractSkills(textContent),
    };
    
    return extractedData;
  } 
  catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
  finally {
    // Clean up the uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
};

/**
 * Extract name from text content
 */
function extractName(text) {
  // Simple heuristic: First line might be the name
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const possibleName = lines[0].trim();
    // Check if it's likely a name (2-3 words, each capitalized)
    const words = possibleName.split(' ').filter(w => w.length > 0);
    if (words.length >= 1 && words.length <= 3) {
      return possibleName;
    }
  }
  return null;
}

/**
 * Extract email from text content
 */
function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
}

/**
 * Extract phone number from text content
 */
function extractPhone(text) {
  const phoneRegex = /(\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : null;
}