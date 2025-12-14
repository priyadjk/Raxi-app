import React from 'react';
import { Source } from '../types';

interface Props {
  sources: Source[];
}

export const SourceList: React.FC<Props> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources based on URI
  const uniqueSourcesMap = new Map<string, Source>();
  sources.forEach(source => {
    uniqueSourcesMap.set(source.uri, source);
  });
  const uniqueSources = Array.from(uniqueSourcesMap.values());

  return (
    <div className="mt-4 pt-3 border-t border-gray-700/50">
      <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Sources
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.slice(0, 4).map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700/50 max-w-[200px]"
          >
            <div className="w-4 h-4 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-[8px] text-white">
                {source.title.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-gray-200 truncate font-medium group-hover:text-blue-300 transition-colors">
                {source.title}
                </span>
                <span className="text-[10px] text-gray-500 truncate">
                    {new URL(source.uri).hostname.replace('www.', '')}
                </span>
            </div>
          </a>
        ))}
        {uniqueSources.length > 4 && (
            <div className="px-2 py-2 text-xs text-gray-500 flex items-center">
                +{uniqueSources.length - 4} more
            </div>
        )}
      </div>
    </div>
  );
};