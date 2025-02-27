import React, { useState, useEffect } from 'react';
import SkillsFlowChart from './SkillsFlowChart';

// Add debugging for React Flow implementation
const SkillsFlowWrapper = ({ nodes: initialNodes, edges: initialEdges }) => {
  const [nodes, setNodes] = useState(initialNodes || []);
  const [edges, setEdges] = useState(initialEdges || []);
  const [debugInfo, setDebugInfo] = useState({
    nodesCount: 0,
    draggableNodes: 0,
    edgesCount: 0
  });

  // Monitor nodes and edges for debugging
  useEffect(() => {
    if (initialNodes) {
      // Process nodes to ensure they're draggable
      const processedNodes = initialNodes.map(node => ({
        ...node,
        draggable: true,
        // Ensure node has necessary properties
        position: node.position || { x: 0, y: 0 },
        data: {
          ...node.data,
          label: node.data?.label || 'Unnamed Node'
        }
      }));
      
      setNodes(processedNodes);
      
      // Debug info
      setDebugInfo(prev => ({
        ...prev,
        nodesCount: processedNodes.length,
        draggableNodes: processedNodes.filter(n => n.draggable).length
      }));
      
      console.log('Processed nodes:', processedNodes);
    }
  }, [initialNodes]);

  useEffect(() => {
    if (initialEdges) {
      setEdges(initialEdges);
      setDebugInfo(prev => ({
        ...prev,
        edgesCount: initialEdges.length
      }));
      console.log('Edges:', initialEdges);
    }
  }, [initialEdges]);

  // Function to log node movement for debugging
  const logNodeMovement = (node, position) => {
    console.log(`Node ${node.id} moved to:`, position);
  };

  return (
    <div className="skills-flow-wrapper" style={{ height: '100%', width: '100%' }}>
      {/* Debug Panel - Only visible during development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-panel p-2 bg-gray-100 text-xs border-b border-gray-300">
          <div className="flex space-x-4">
            <div>Nodes: {debugInfo.nodesCount}</div>
            <div>Draggable: {debugInfo.draggableNodes}</div>
            <div>Edges: {debugInfo.edgesCount}</div>
          </div>
        </div>
      )}

      {/* The actual flow chart */}
      <SkillsFlowChart
        nodes={nodes} 
        edges={edges}
        onNodeDragStop={logNodeMovement}
      />
    </div>
  );
};

export default SkillsFlowWrapper;