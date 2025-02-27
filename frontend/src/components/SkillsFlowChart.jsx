import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import custom node types
import { customNodeTypes } from './customNodes';

// Use the custom node types
const nodeTypes = customNodeTypes;

const SkillsFlowChart = ({ nodes: initialNodes, edges: initialEdges }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [bgColor, setBgColor] = useState('#f8fafc'); // Light background color

  // IMPORTANT: Set draggable flag for all nodes
  const processedInitialNodes = initialNodes?.map(node => ({
    ...node,
    draggable: true, // Make sure all nodes are draggable
    // Add default styles if not provided
    style: {
      ...node.style,
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: node.type === 'input' ? 'bold' : 'normal',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '10px',
      transition: 'all 0.2s ease',
    },
  })) || [];

  // Initialize with processed nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(processedInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);

  // Update nodes when props change
  useEffect(() => {
    if (initialNodes?.length > 0) {
      // Make sure all nodes are draggable when they change
      const styledNodes = initialNodes.map(node => ({
        ...node,
        draggable: true, // Ensure this is set
        style: {
          ...node.style,
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: node.type === 'input' ? 'bold' : 'normal',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '10px',
          transition: 'all 0.2s ease',
        },
      }));
      setNodes(styledNodes);
    }
  }, [initialNodes, setNodes]);

  // Update edges when props change
  useEffect(() => {
    if (initialEdges?.length > 0) {
      // Add custom styles to edges
      const styledEdges = initialEdges.map(edge => ({
        ...edge,
        // Default marker for all edges
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: edge.style?.stroke || '#999',
        },
        // Add label background and styling if the edge has a label
        labelStyle: edge.label ? { 
          fill: '#333', 
          fontWeight: 500,
          fontSize: '12px',
        } : {},
        labelBgStyle: edge.label ? { 
          fill: 'rgba(255, 255, 255, 0.8)',
          fillOpacity: 0.8,
          borderRadius: '4px',
          padding: '2px 4px',
        } : {},
      }));
      setEdges(styledEdges);
    }
  }, [initialEdges, setEdges]);

  // Initialize the React Flow instance
  const onInit = useCallback(
    (instance) => {
      setReactFlowInstance(instance);
      
      // Apply zoom and center on init after a short delay to ensure rendering
      setTimeout(() => {
        if (instance && nodes.length > 0) {
          instance.fitView({ padding: 0.2 });
        }
      }, 100);
    },
    [nodes.length]
  );
  
  // Handle edge connections
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(
      {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      },
      eds
    )),
    [setEdges]
  );

  // Handle node click to highlight connected edges
  const onNodeClick = useCallback((event, node) => {
    // Find connected edges
    const connectedEdges = edges.filter(edge => 
      edge.source === node.id || edge.target === node.id
    );
    
    // Highlight the node and connected edges
    setNodes(nds => 
      nds.map(n => ({
        ...n,
        style: {
          ...n.style,
          boxShadow: n.id === node.id ? '0 0 0 2px #3b82f6' : n.style.boxShadow,
          zIndex: n.id === node.id ? 1000 : n.style.zIndex || 0,
          transform: n.id === node.id ? 'scale(1.05)' : 'scale(1)',
        },
      }))
    );
    
    setEdges(eds => 
      eds.map(e => ({
        ...e,
        // Store original values to restore later
        originalStroke: e.originalStroke || e.style?.stroke || '#999',
        originalWidth: e.originalWidth || e.style?.strokeWidth || 1.5,
        originalAnimated: e.originalAnimated === undefined ? e.animated : e.originalAnimated,
        style: {
          ...e.style,
          stroke: connectedEdges.some(ce => ce.id === e.id) 
            ? '#3b82f6' 
            : e.style?.stroke || '#999',
          strokeWidth: connectedEdges.some(ce => ce.id === e.id) ? 3 : 1.5,
          opacity: connectedEdges.length > 0 
            ? (connectedEdges.some(ce => ce.id === e.id) ? 1 : 0.25) 
            : 1,
        },
        animated: connectedEdges.some(ce => ce.id === e.id),
      }))
    );
  }, [edges, setEdges, setNodes]);

  // Reset highlights on pane click
  const onPaneClick = useCallback(() => {
    setNodes(nds => 
      nds.map(n => ({
        ...n,
        style: {
          ...n.style,
          boxShadow: (n.style?.boxShadow || '').replace('0 0 0 2px #3b82f6', '0 1px 3px rgba(0,0,0,0.1)'),
          zIndex: 0,
          transform: 'scale(1)',
        },
      }))
    );
    
    setEdges(eds => 
      eds.map(e => ({
        ...e,
        style: {
          ...e.style,
          stroke: e.originalStroke || e.style?.stroke || '#999',
          strokeWidth: e.originalWidth || 1.5,
          opacity: 1,
        },
        animated: e.originalAnimated || false,
      }))
    );
  }, [setNodes, setEdges]);

  // Custom styles for ReactFlow
  const flowStyles = {
    background: bgColor,
    width: '100%',
    height: '100%',
  };

  return (
    <div className="react-flow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        style={flowStyles}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';
            if (n.type === 'default') return '#1a192b';
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.type === 'input') return '#d0e5ff';
            return '#fff';
          }}
          maskColor={`${bgColor}70`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <Panel position="top-right">
          <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              onChange={(e) => setBgColor(e.target.value)}
              value={bgColor}
            >
              <option value="#f8fafc">Light</option>
              <option value="#f1f5f9">Gray</option>
              <option value="#ecfdf5">Green</option>
              <option value="#eff6ff">Blue</option>
              <option value="#eef2ff">Indigo</option>
            </select>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Set default props
SkillsFlowChart.defaultProps = {
  nodes: [],
  edges: []
};

export default SkillsFlowChart;