import React from 'react';

const SkillsResults = ({ results }) => {
  if (!results) return null;

  const { skills, name, email, phone } = results;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Extracted Information</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Name</span>
            <span className="block mt-1">{name || 'Not found'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Email</span>
            <span className="block mt-1">{email || 'Not found'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Phone</span>
            <span className="block mt-1">{phone || 'Not found'}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsResults;