import React from 'react';

interface Props {
  content: string;
}

// A simple parser to handle bolding and code blocks without heavy dependencies
// This ensures the code runs immediately in the generated environment.
export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-gray-300 leading-7 text-[15px] space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // It's a code block
          const content = part.slice(3, -3).replace(/^([a-z]+)\n/, ''); // Remove language identifier if strictly needed
          // Try to extract language for display
          const match = part.match(/^```([a-z]+)/);
          const lang = match ? match[1] : '';
          
          return (
            <div key={index} className="my-4 rounded-lg overflow-hidden border border-gray-700 bg-[#0d0d0d]">
              {lang && (
                <div className="px-4 py-1.5 bg-[#1e1e1e] text-xs text-gray-400 font-mono border-b border-gray-700 flex justify-between">
                  <span>{lang}</span>
                  <span>Code</span>
                </div>
              )}
              <div className="p-4 overflow-x-auto">
                <code className="font-mono text-sm text-blue-300 whitespace-pre">{content}</code>
              </div>
            </div>
          );
        }

        // Standard text processing for bold (**text**) and newlines
        // We split by newlines to handle paragraphs
        const lines = part.split('\n');
        return lines.map((line, lineIdx) => {
            // Skip empty lines at immediate start/end if they are just artifacts of split
            if (line.trim() === '' && lines.length > 1) return null;

            // List item detection
            const isListItem = line.trim().startsWith('- ') || line.trim().match(/^\d+\.\s/);
            
            // Process Bold: **text**
            const segments = line.split(/(\*\*.*?\*\*)/g);
            
            const renderedLine = segments.map((seg, i) => {
              if (seg.startsWith('**') && seg.endsWith('**')) {
                return <strong key={i} className="font-semibold text-white">{seg.slice(2, -2)}</strong>;
              }
              // Basic URL parsing
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const urlParts = seg.split(urlRegex);
              if (urlParts.length > 1) {
                  return urlParts.map((uPart, uIdx) => {
                      if (uPart.match(urlRegex)) {
                          return <a key={`${i}-${uIdx}`} href={uPart} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{uPart}</a>
                      }
                      return uPart;
                  })
              }
              return seg;
            });

            return (
              <p key={`${index}-${lineIdx}`} className={`mb-2 ${isListItem ? 'ml-4' : ''}`}>
                 {renderedLine}
              </p>
            );
        });
      })}
    </div>
  );
};
