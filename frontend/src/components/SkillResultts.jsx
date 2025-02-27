import React, { useState, useCallback } from 'react';
import { chatSession } from '../config/gemini';
import SkillsFlowChart from './SkillsFlowChart'; // The component we'll create next

const SkillsResults = ({ results }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('skills'); // 'skills' or 'roadmap'
  
  if (!results) return null;
  const { skills, name, email, phone } = results.data;
  
  // Group skills by category
  const skillCategories = {
    "Programming Languages": skills?.filter(skill =>
      ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'PHP', 'Ruby'].includes(skill)) || [],
    "Frameworks & Libraries": skills?.filter(skill =>
      ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Spring'].includes(skill)) || [],
    "Other Skills": skills?.filter(skill =>
      !['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'PHP', 'Ruby',
        'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Spring'].includes(skill)) || []
  };

  // Generate skills roadmap and flow chart data
  const generateRoadmap = async () => {
    setLoading(true);
    try {
      // First generate a career roadmap based on skills
      const roadmapPrompt = `Based on these skills: ${skills.join(', ')}, create a detailed career roadmap with learning paths. 
      Return the response as a valid JSON object with this structure:
      {
        "career_paths": [
          {
            "title": "Career Path Name",
            "description": "Brief description",
            "required_skills": ["skill1", "skill2"],
            "skills_to_acquire": ["skill3", "skill4"],
            "learning_resources": [
              { "name": "Resource name", "type": "course/book/tutorial", "difficulty": "beginner/intermediate/advanced" }
            ],
            "estimated_timeframe": "X months/years"
          }
        ]
      }`;
      
      const roadmapResult = await chatSession.sendMessage(roadmapPrompt);
      const roadmapText = roadmapResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      let parsedRoadmap;
      try {
        // Extract JSON from the response (in case AI adds any additional text)
        const jsonMatch = roadmapText.match(/(\{[\s\S]*\})/);
        const jsonString = jsonMatch ? jsonMatch[0] : roadmapText;
        parsedRoadmap = JSON.parse(jsonString);
        setRoadmap(parsedRoadmap);
        
        // Generate flow chart data from the roadmap
        if (parsedRoadmap && parsedRoadmap.career_paths) {
          const flowChartPrompt = `Based on this career roadmap: ${JSON.stringify(parsedRoadmap)}, 
          create a React Flow compatible JSON object with nodes and edges that visualizes the skills and learning paths.
          Return only the valid JSON without any additional text.
          
          The format should be:
          {
            "nodes": [
              { "id": "unique-id", "type": "input|default|output", "data": { "label": "Node Label" }, "position": { "x": 0, "y": 0 }, "style": { "background": "#color", "color": "#color", "border": "1px solid #color", "width": 180 } }
            ],
            "edges": [
              { "id": "edge-id", "source": "source-node-id", "target": "target-node-id", "label": "optional label", "animated": true|false, "style": { "stroke": "#color" } }
            ]
          }
          
          Important guidelines:
          - Position nodes in a visually pleasing layout with proper spacing
          - Use different colors for different types of skills/paths
          - Career paths should be at the top level
          - Required skills branch from career paths
          - Skills to acquire branch from required skills
          - Recommended resources can be linked to skills to acquire
          - Be creative with the visual design but keep it professional
          `;
          
          const flowChartResult = await chatSession.sendMessage(flowChartPrompt);
          let flowChartText = flowChartResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          // Clean up the flowChart JSON (remove markdown if present)
          flowChartText = flowChartText.replace(/```json/g, '').replace(/```/g, '').trim();
          
          try {
            const flowChartData = JSON.parse(flowChartText);
            setFlowNodes(flowChartData.nodes || []);
            setFlowEdges(flowChartData.edges || []);
          } catch (error) {
            console.error('Failed to parse flow chart JSON:', error);
            
            // Fallback: Create basic flow chart data
            createBasicFlowChart(parsedRoadmap);
          }
        }
      } catch (error) {
        console.error('Failed to parse roadmap JSON:', error);
        console.log('Raw response:', roadmapText);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
      setActiveView('roadmap');
    }
  };
  
  // Fallback function to create a basic flow chart if the AI-generated one fails
  const createBasicFlowChart = (roadmapData) => {
    const nodes = [];
    const edges = [];
    
    // Create a central "Your Skills" node
    nodes.push({
      id: 'your-skills',
      type: 'input',
      data: { label: 'Your Skills' },
      position: { x: 250, y: 50 },
      style: { 
        background: '#3B82F6', 
        color: 'white',
        border: '1px solid #2563EB',
        borderRadius: '8px',
        padding: '10px',
        fontWeight: 'bold',
        width: 180
      }
    });
    
    // Add career path nodes
    roadmapData.career_paths.forEach((path, pathIndex) => {
      // Career path node
      const pathId = `path-${pathIndex}`;
      nodes.push({
        id: pathId,
        data: { label: path.title },
        position: { x: 250, y: 150 + (pathIndex * 300) },
        style: { 
          background: '#EFF6FF', 
          color: '#1E40AF',
          border: '1px solid #BFDBFE',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 'bold',
          width: 200
        }
      });
      
      // Connect from central node to career path
      edges.push({
        id: `edge-your-skills-to-${pathId}`,
        source: 'your-skills',
        target: pathId,
        animated: true,
        style: { stroke: '#3B82F6' }
      });
      
      // Add required skills
      if (path.required_skills) {
        path.required_skills.forEach((skill, skillIndex) => {
          const reqSkillId = `req-skill-${pathIndex}-${skillIndex}`;
          nodes.push({
            id: reqSkillId,
            data: { label: `✓ ${skill}` },
            position: { x: 50, y: 150 + (pathIndex * 300) + ((skillIndex + 1) * 60) },
            style: { 
              background: '#DCFCE7', 
              color: '#166534',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '6px',
              width: 150
            }
          });
          
          // Connect from career path to required skill
          edges.push({
            id: `edge-${pathId}-to-${reqSkillId}`,
            source: pathId,
            target: reqSkillId,
            label: 'Have',
            style: { stroke: '#22C55E' }
          });
        });
      }
      
      // Add skills to acquire
      if (path.skills_to_acquire) {
        path.skills_to_acquire.forEach((skill, skillIndex) => {
          const acquireSkillId = `acquire-skill-${pathIndex}-${skillIndex}`;
          nodes.push({
            id: acquireSkillId,
            data: { label: skill },
            position: { x: 450, y: 150 + (pathIndex * 300) + ((skillIndex + 1) * 60) },
            style: { 
              background: '#FEF3C7', 
              color: '#92400E',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              padding: '6px',
              width: 150
            }
          });
          
          // Connect from career path to skill to acquire
          edges.push({
            id: `edge-${pathId}-to-${acquireSkillId}`,
            source: pathId,
            target: acquireSkillId,
            label: 'Learn',
            style: { stroke: '#F59E0B' }
          });
        });
      }
    });
    
    setFlowNodes(nodes);
    setFlowEdges(edges);
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg mt-8 border border-blue-100">
      <div className="flex items-center justify-between border-b border-blue-200 pb-4 mb-6">
        <div className="flex items-center">
          <div className="bg-blue-600 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Skills Analysis & Career Roadmap</h2>
        </div>
        
        {/* View toggle buttons */}
        {skills && skills.length > 0 && (
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveView('skills')} 
              className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'skills' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Skills
            </button>
            <button 
              onClick={() => activeView === 'roadmap' ? setActiveView('skills') : generateRoadmap()} 
              className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'roadmap' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Career Roadmap
            </button>
          </div>
        )}
      </div>
      
      {/* Personal Information Card */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-md transform transition-all hover:scale-[1.01]">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="block text-sm font-medium text-gray-500 mb-1">Name</span>
            <span className="block font-semibold text-gray-800 truncate">{name || 'Not found'}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="block text-sm font-medium text-gray-500 mb-1">Email</span>
            <span className="block font-semibold text-gray-800 truncate">{email || 'Not found'}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="block text-sm font-medium text-gray-500 mb-1">Phone</span>
            <span className="block font-semibold text-gray-800 truncate">{phone || 'Not found'}</span>
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-blue-500 font-medium">Generating your career roadmap...</span>
        </div>
      )}
      
      {/* Skills View */}
      {activeView === 'skills' && !loading && (
        <div className="bg-white rounded-lg p-6 shadow-md transform transition-all hover:scale-[1.01]">
          <div className="flex items-center mb-5">
            <div className="bg-blue-100 p-2 rounded-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Professional Skills</h3>
          </div>
          
          {skills && skills.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(skillCategories).map(([category, categorySkills]) => 
                categorySkills.length > 0 && (
                  <div key={category} className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-3">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-600 font-medium">No skills were detected in the resume</p>
              <p className="text-gray-500 text-sm mt-2">Try uploading a different resume or check the format</p>
            </div>
          )}
          
          {skills && skills.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-800">{skills.length} skills</strong> identified from your resume
                  </span>
                </div>
                
                <button 
                  onClick={generateRoadmap}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Generate Career Roadmap
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Roadmap View */}
      {activeView === 'roadmap' && !loading && roadmap && (
        <div className="space-y-6">
          {/* React Flow Diagram Card */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Skills Roadmap Visualization</h3>
            </div>
            
            {/* React Flow Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '1000px' }}>
              <SkillsFlowChart 
                nodes={flowNodes} 
                edges={flowEdges} 
              />
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Career Path</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-green-200 mr-2"></div>
                  <span className="text-sm text-gray-600">Skills You Have</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-yellow-200 mr-2"></div>
                  <span className="text-sm text-gray-600">Skills to Learn</span>
                </div>
              </div>
              
              <span className="text-sm text-gray-500">
                <span className="font-medium">Tip:</span> Drag to reposition nodes, scroll to zoom
              </span>
            </div>
          </div>
          
          {/* Career Paths Cards */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-5">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Recommended Career Paths</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {roadmap?.career_paths?.map((path, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">{path.title}</h4>
                  <p className="text-gray-600 mb-4">{path.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Skills You Already Have</h5>
                      <div className="flex flex-wrap gap-2">
                        {path.required_skills?.map((skill, idx) => (
                          <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Skills to Acquire</h5>
                      <div className="flex flex-wrap gap-2">
                        {path.skills_to_acquire?.map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Learning Resources</h5>
                      <ul className="space-y-2">
                        {path.learning_resources?.map((resource, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                            <span className="text-sm">
                              <span className="font-medium">{resource.name}</span>
                              <span className="text-gray-500"> - {resource.type}, {resource.difficulty}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <span className="text-sm text-blue-600 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Estimated timeline: {path.estimated_timeframe}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        {activeView === 'skills' && skills && skills.length > 0 && (
          <button 
            onClick={generateRoadmap} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Generate Interactive Roadmap
          </button>
        )}
        
        {activeView === 'roadmap' && roadmap && (
          <button 
            onClick={() => window.print()} 
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Roadmap
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillsResults;