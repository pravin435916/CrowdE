import React, { useState } from 'react';
import ResumeForm from '../components/ResumeForm';
import SkillsResults from '../components/SkillResultts';

function Hero() {
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">Resume Skills Extractor</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your resume and we'll extract your skills
          </p>
        </header>
        
        <ResumeForm onResultsReceived={setResults} />
        
        {results && <SkillsResults results={results} />}
      </div>
    </div>
  );
}

export default Hero;