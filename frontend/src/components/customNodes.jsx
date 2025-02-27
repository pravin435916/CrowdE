import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Career Path Node
export const CareerNode = memo(({ data, isConnectable }) => {
  return (
    <div className="career-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-600"
      />
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="text-center font-bold">{data.label}</div>
        {data.description && (
          <div className="text-xs mt-1 opacity-80 line-clamp-2">{data.description}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-600"
      />
    </div>
  );
});

// Existing Skill Node
export const ExistingSkillNode = memo(({ data, isConnectable }) => {
  return (
    <div className="skill-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-green-600"
      />
      <div className="p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 flex items-center">
        <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center mr-2 shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div className="font-medium">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-green-600"
      />
    </div>
  );
});

// Learning Skill Node
export const LearningSkillNode = memo(({ data, isConnectable }) => {
  return (
    <div className="learning-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-amber-500"
      />
      <div className="p-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 flex items-center">
        <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center mr-2 shrink-0">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div className="font-medium">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-amber-500"
      />
    </div>
  );
});

// Resource Node
export const ResourceNode = memo(({ data, isConnectable }) => {
  return (
    <div className="resource-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-purple-500"
      />
      <div className="p-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-800">
        <div className="flex items-center">
          {data.resourceType === 'course' && (
            <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          )}
          {data.resourceType === 'book' && (
            <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          )}
          {data.resourceType === 'tutorial' && (
            <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          )}
          <div className="font-medium text-sm">{data.label}</div>
        </div>
        {data.difficulty && (
          <div className="mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              data.difficulty === 'beginner' 
                ? 'bg-green-100 text-green-700' 
                : data.difficulty === 'intermediate'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {data.difficulty}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

// Central Skills Hub Node
export const SkillsHubNode = memo(({ data, isConnectable }) => {
  return (
    <div className="skills-hub-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-600"
      />
      <div className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <div className="font-bold text-lg">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-600"
      />
    </div>
  );
});

// Timeline Node
export const TimelineNode = memo(({ data, isConnectable }) => {
  return (
    <div className="timeline-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-500"
      />
      <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="font-medium text-sm">{data.label}</div>
        </div>
      </div>
    </div>
  );
});

// Default Node - fallback for any type that doesn't match
export const DefaultNode = memo(({ data, isConnectable }) => {
  return (
    <div className="default-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-500"
      />
      <div className="p-2 rounded-lg border border-gray-200 bg-white text-gray-800">
        <div className="font-medium">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-500"
      />
    </div>
  );
});

// Export all custom nodes
export const customNodeTypes = {
  careerNode: CareerNode,
  existingSkillNode: ExistingSkillNode,
  learningSkillNode: LearningSkillNode,
  resourceNode: ResourceNode,
  skillsHubNode: SkillsHubNode,
  timelineNode: TimelineNode,
  default: DefaultNode,  // Add a default fallback node type
  input: DefaultNode,    // Also map input type to default
  output: DefaultNode,   // Also map output type to default
};