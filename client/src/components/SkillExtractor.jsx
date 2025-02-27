// File: SkillExtractor.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';

const SkillExtractor = () => {
  const [file, setFile] = useState(null);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadType, setUploadType] = useState('resume'); // 'resume' or 'linkedin'

  // Common skills by industry/role for matching
  const skillKeywords = {
    technical: [
      'javascript', 'python', 'java', 'c++', 'react', 'angular', 'vue', 'node.js', 
      'express', 'django', 'flask', 'spring', 'hibernate', 'sql', 'nosql', 'mongodb', 
      'postgresql', 'mysql', 'oracle', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 
      'jenkins', 'ci/cd', 'git', 'github', 'gitlab', 'bitbucket', 'rest api', 'graphql', 
      'html', 'css', 'sass', 'less', 'redux', 'typescript', 'webpack', 'babel', 'npm', 'yarn',
      'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
      'tableau', 'power bi', 'excel', 'r', 'hadoop', 'spark', 'kafka', 'airflow', 'luigi',
      'blockchain', 'solidity', 'ethereum', 'smart contracts', 'web3', 'nft', 'defi',
      'machine learning', 'artificial intelligence', 'deep learning', 'nlp', 'computer vision',
      'data science', 'data engineering', 'data analytics', 'big data', 'data visualization',
      'selenium', 'cypress', 'jest', 'mocha', 'chai', 'junit', 'testng', 'php', 'laravel',
      'symfony', 'codeigniter', 'ruby', 'ruby on rails', 'swift', 'objective-c', 'kotlin',
      'flutter', 'react native', 'xamarin', 'ionic', 'unity', 'unreal engine', 'godot',
      'c#', '.net', 'asp.net', 'wcf', 'wpf', 'winforms', 'linux', 'unix', 'shell scripting',
      'bash', 'powershell', 'networking', 'tcp/ip', 'dns', 'http', 'https', 'ftp', 'ssh'
    ],
    business: [
      'project management', 'agile', 'scrum', 'kanban', 'waterfall', 'jira', 'confluence',
      'trello', 'asana', 'monday', 'ms project', 'gantt', 'product management', 'product owner',
      'product development', 'roadmap', 'stakeholder management', 'customer development',
      'market research', 'competitive analysis', 'user research', 'user testing', 'a/b testing',
      'ux research', 'user stories', 'user flows', 'wireframing', 'prototyping', 'mockups',
      'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'marketing', 'digital marketing',
      'content marketing', 'social media marketing', 'seo', 'sem', 'google analytics',
      'google ads', 'facebook ads', 'instagram ads', 'linkedin ads', 'twitter ads',
      'email marketing', 'mailchimp', 'hubspot', 'marketo', 'salesforce', 'crm',
      'customer relationship management', 'customer success', 'customer support',
      'helpdesk', 'zendesk', 'freshdesk', 'intercom', 'sales', 'business development',
      'account management', 'partnership', 'negotiation', 'presentation', 'public speaking',
      'communication', 'leadership', 'team management', 'coaching', 'mentoring', 'training',
      'recruitment', 'hiring', 'onboarding', 'performance review', 'budget management',
      'financial planning', 'financial analysis', 'forecasting', 'reporting', 'dashboards',
      'kpi', 'metrics', 'data-driven', 'decision making', 'strategic planning',
      'business strategy', 'business model', 'business plan', 'business analysis',
      'requirements gathering', 'process improvement', 'process optimization', 'change management'
    ],
    soft: [
      'communication', 'teamwork', 'collaboration', 'problem solving', 'critical thinking',
      'creativity', 'innovation', 'adaptability', 'flexibility', 'resilience', 'time management',
      'organization', 'prioritization', 'attention to detail', 'analytical thinking',
      'decision making', 'leadership', 'mentoring', 'coaching', 'conflict resolution',
      'negotiation', 'persuasion', 'presentation', 'public speaking', 'writing', 'editing',
      'emotional intelligence', 'empathy', 'cultural awareness', 'diversity', 'inclusion',
      'self-motivation', 'self-discipline', 'work ethic', 'integrity', 'accountability',
      'responsibility', 'initiative', 'proactivity', 'customer focus', 'user focus',
      'learning agility', 'curiosity', 'passion', 'enthusiasm', 'positive attitude',
      'stress management', 'work-life balance', 'networking', 'relationship building'
    ],
    certifications: [
      'pmp', 'prince2', 'scrum master', 'csm', 'safe', 'itil', 'cobit', 'six sigma',
      'lean', 'cpa', 'cfa', 'cma', 'aws certified', 'aws solutions architect',
      'aws developer', 'aws sysops', 'azure fundamentals', 'az-900', 'az-104',
      'az-204', 'az-303', 'az-304', 'az-400', 'gcp certified', 'comptia a+',
      'comptia network+', 'comptia security+', 'comptia cloud+', 'comptia project+',
      'ccna', 'ccnp', 'ccie', 'rhce', 'rhcsa', 'mcsa', 'mcse', 'mcts', 'mcitp',
      'ceh', 'cissp', 'cism', 'cisa', 'oscp', 'pci dss', 'iso 27001', 'cobit',
      'togaf', 'itil', 'google analytics', 'google ads', 'hubspot', 'salesforce',
      'servicenow', 'adobe certified', 'autodesk certified', 'apple certified',
      'microsoft certified', 'cisco certified', 'oracle certified', 'sap certified',
      'shrm', 'hrci', 'phr', 'sphr', 'gphr'
    ]
  };

  // Helper function to extract text from PDF (using browser's built-in PDF.js)
  const extractTextFromPDF = async (file) => {
    // This is a simplified version - in a real app, you'd use a PDF parsing library
    // like pdf.js that works in React
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // In a real implementation, this would be replaced with proper PDF parsing
        const text = "This is placeholder text that would come from PDF parsing";
        resolve(text);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Helper function to extract text from DOCX using mammoth
  const extractTextFromDOCX = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to extract text from different file types
  const extractTextFromFile = async (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    
    switch (fileType) {
      case 'pdf':
        return await extractTextFromPDF(file);
      case 'docx':
        return await extractTextFromDOCX(file);
      case 'doc':
        return "DOC files require additional processing. This is placeholder text.";
      case 'txt':
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsText(file);
        });
      case 'csv':
        return new Promise((resolve) => {
          Papa.parse(file, {
            complete: (results) => {
              resolve(results.data.flat().join(' '));
            }
          });
        });
      case 'xlsx':
      case 'xls':
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            resolve(jsonData.flat().join(' '));
          };
          reader.readAsArrayBuffer(file);
        });
      default:
        throw new Error(`Unsupported file type: .${fileType}`);
    }
  };

  // Function to extract skills from text using NLP techniques
  const extractSkillsFromText = (text) => {
    if (!text) return [];
    
    const cleanText = text.toLowerCase();
    const allSkills = [
      ...skillKeywords.technical,
      ...skillKeywords.business,
      ...skillKeywords.soft,
      ...skillKeywords.certifications
    ];
    
    // Simple keyword matching (in a real application, use a proper NLP library)
    const foundSkills = allSkills.filter(skill => 
      cleanText.includes(skill.toLowerCase())
    );
    
    // Group skills by category
    const groupedSkills = {
      technical: foundSkills.filter(skill => skillKeywords.technical.includes(skill)),
      business: foundSkills.filter(skill => skillKeywords.business.includes(skill)),
      soft: foundSkills.filter(skill => skillKeywords.soft.includes(skill)),
      certifications: foundSkills.filter(skill => skillKeywords.certifications.includes(skill))
    };
    
    return groupedSkills;
  };

  // Function to extract information from LinkedIn profile
  const extractFromLinkedIn = async () => {
    // In a real application, you would:
    // 1. Either use LinkedIn API (requires partnership/authorization)
    // 2. Or use a service that scrapes public LinkedIn profiles
    // 3. Or ask the user to export their LinkedIn data as a CSV/JSON
    
    setIsLoading(true);
    setError('');
    
    try {
      // Mock data for demonstration
      setTimeout(() => {
        const mockLinkedInData = {
          technical: ['javascript', 'react', 'node.js', 'mongodb', 'aws'],
          business: ['product management', 'agile', 'scrum'],
          soft: ['communication', 'teamwork', 'leadership'],
          certifications: ['aws certified', 'scrum master']
        };
        
        setExtractedSkills(mockLinkedInData);
        setIsLoading(false);
      }, 2000); // Simulate API call delay
    } catch (error) {
      setError('Failed to extract data from LinkedIn profile. Please try again.');
      setIsLoading(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsLoading(true);
    setError('');
    
    try {
      const text = await extractTextFromFile(selectedFile);
      const skills = extractSkillsFromText(text);
      setExtractedSkills(skills);
    } catch (error) {
      setError(`Error processing file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (uploadType === 'linkedin') {
      if (!linkedInUrl.includes('linkedin.com/')) {
        setError('Please enter a valid LinkedIn URL');
        return;
      }
      extractFromLinkedIn();
    } else {
      if (!file) {
        setError('Please upload a resume file');
        return;
      }
      // File processing happens in the handleFileUpload function
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">SkillNavigator AI</h1>
      <h2 className="text-xl mb-4 text-gray-700">Resume & LinkedIn Skill Extractor</h2>
      
      {/* Upload Type Selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              uploadType === 'resume' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setUploadType('resume')}
          >
            Upload Resume
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              uploadType === 'linkedin' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setUploadType('linkedin')}
          >
            Link LinkedIn Profile
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        {uploadType === 'resume' ? (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload your resume</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md inline-block"
              >
                Choose File
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {file ? file.name : 'Supported formats: PDF, DOCX, TXT, CSV, XLSX'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">LinkedIn Profile URL</label>
            <input
              type="text"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/yourprofile"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        )}
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Extract Skills'}
        </button>
      </form>
      
      {/* Results Section */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : Object.keys(extractedSkills).length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Extracted Skills</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(extractedSkills).map(([category, skills]) => (
              skills.length > 0 && (
                <div key={category} className="bg-white p-4 rounded shadow">
                  <h4 className="text-lg font-medium mb-2 capitalize">{category} Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
          
          <div className="mt-8 border-t pt-4">
            <h4 className="text-lg font-medium mb-3 text-gray-800">Skill Gap Analysis</h4>
            <p className="text-gray-600 mb-4">
              Based on your profile, here are some skill areas you might consider developing:
            </p>
            
            {/* This would use more sophisticated analysis in a real app */}
            <ul className="list-disc pl-5 text-gray-700">
              <li className="mb-2">Cloud Technologies: Consider expanding your {extractedSkills.technical?.includes('aws') ? 'AWS' : 'cloud'} knowledge with containerization technologies like Docker and Kubernetes</li>
              <li className="mb-2">Data Science: Adding data analysis skills would complement your technical profile</li>
              <li className="mb-2">Modern Development: Keep up with latest frameworks and tools in your stack</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillExtractor;