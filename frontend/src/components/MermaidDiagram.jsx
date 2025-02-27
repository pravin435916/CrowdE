import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  },
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
});

const MermaidDiagram = ({ chart, className }) => {
  const mermaidRef = useRef(null);
  const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (chart && mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      
      // Render the diagram
      try {
        mermaid.render(uniqueId, chart).then(result => {
          mermaidRef.current.innerHTML = result.svg;
        });
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        mermaidRef.current.innerHTML = `
          <div class="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            <p class="font-medium">Error rendering diagram</p>
            <p class="text-sm mt-1">${error.message}</p>
            <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">${chart}</pre>
          </div>
        `;
      }
    }
  }, [chart, uniqueId]);

  return (
    <div 
      ref={mermaidRef} 
      className={`mermaid-diagram ${className || ''}`}
    >
      {!chart && (
        <div className="p-4 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 text-center">
          No diagram content provided
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;