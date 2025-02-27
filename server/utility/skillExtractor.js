// A large set of common technical skills
const COMMON_SKILLS = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust', 'Scala', 'Perl', 'R',
    
    // Web Technologies
    'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django',
    'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'jQuery',
    'Bootstrap', 'Tailwind CSS', 'Next.js', 'Gatsby', 'Redux',
    
    // Database
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Oracle',
    'SQL Server', 'SQLite', 'NoSQL', 'Redis', 'Cassandra', 'DynamoDB',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'Terraform', 'Ansible', 'Puppet',
    
    // Data Science & ML
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'Data Analysis', 'NLP', 'Computer Vision', 'Statistics',
    
    // Soft Skills
    'Project Management', 'Team Leadership', 'Communication', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Agile', 'Scrum',
    
    // Design
    'UI/UX', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch',
    
    // Mobile
    'iOS', 'Android', 'React Native', 'Flutter', 'Xamarin',
    
    // Testing
    'Unit Testing', 'Integration Testing', 'Jest', 'Mocha', 'Selenium', 'Cypress'
  ];
  
  // Sections where skills are commonly found
  const SKILL_SECTION_HEADERS = [
    'skills', 'technical skills', 'technologies', 'competencies',
    'expertise', 'proficiencies', 'core competencies'
  ];
  
  /**
   * Extract skills from resume text
   */
  exports.extractSkills = (text) => {
    const extractedSkills = new Set();
    const textLower = text.toLowerCase();
    
    // 1. Look for skills based on the common skills list
    COMMON_SKILLS.forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      // Check if skill appears as a word boundary
      const regex = new RegExp(`\\b${skillLower}\\b`, 'i');
      if (regex.test(textLower)) {
        extractedSkills.add(skill);
      }
    });
    
    // 2. Try to extract from a skills section if present
    for (const header of SKILL_SECTION_HEADERS) {
      const sectionIndex = textLower.indexOf(header);
      if (sectionIndex !== -1) {
        // Extract text from after the header until next likely section
        const sectionEnd = findNextSection(textLower, sectionIndex + header.length);
        const sectionText = textLower.substring(sectionIndex + header.length, sectionEnd);
        
        // Split by common separators and extract skills
        const potentialSkills = sectionText.split(/[,•|\n\t\/:;]+/)
          .map(s => s.trim())
          .filter(s => s.length > 1 && s.length < 30); // Reasonable skill name length
        
        potentialSkills.forEach(skill => {
          // Clean up skill
          const cleanSkill = skill.replace(/^\s*[-•*]\s*/, '').trim();
          if (cleanSkill && cleanSkill.length > 1) {
            // Capitalize first letter of each word for consistency
            const formattedSkill = cleanSkill.replace(/\b\w/g, c => c.toUpperCase());
            extractedSkills.add(formattedSkill);
          }
        });
      }
    }
    
    return [...extractedSkills];
  };
  
  /**
   * Find the index of the next section header after a given position
   */
  function findNextSection(text, startPos) {
    const sectionHeaders = [
      'education', 'experience', 'work', 'employment', 'projects',
      'certifications', 'languages', 'interests', 'references',
      'accomplishments', 'achievements', 'objective', 'summary'
    ];
    
    let nextSectionPos = text.length;
    
    for (const header of sectionHeaders) {
      const pos = text.indexOf(header, startPos);
      if (pos !== -1 && pos < nextSectionPos) {
        nextSectionPos = pos;
      }
    }
    
    return nextSectionPos;
  }