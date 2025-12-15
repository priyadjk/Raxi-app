import React from 'react';
import { Icons } from '../constants';

export const LibraryPage = () => {
  return (
    <div className="flex-1 h-full bg-[#212121] text-gray-100 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto pt-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
           <span className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400"><Icons.Library /></span>
           Library
        </h1>
        
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-full text-sm">All</button>
            <button className="px-4 py-2 bg-[#303030] hover:bg-[#404040] text-gray-200 rounded-full text-sm transition-colors">Threads</button>
            <button className="px-4 py-2 bg-[#303030] hover:bg-[#404040] text-gray-200 rounded-full text-sm transition-colors">Collections</button>
            <button className="px-4 py-2 bg-[#303030] hover:bg-[#404040] text-gray-200 rounded-full text-sm transition-colors">Images</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {['Physics Notes', 'Coding Snippets', 'Travel Plans', 'Recipes', 'Book List', 'Project Ideas', 'Meeting Notes', 'Gift Ideas', 'Workout Plan'].map((item, i) => (
              <div key={i} className="group p-5 bg-[#1a1a1e] border border-gray-800 rounded-xl hover:bg-[#25252a] hover:border-yellow-400/30 transition-all cursor-pointer">
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-yellow-400 group-hover:bg-yellow-400/10 transition-colors">
                       <Icons.Folder />
                    </div>
                    <button className="text-gray-600 hover:text-white"><Icons.Share /></button>
                 </div>
                 <h3 className="font-semibold text-lg mb-1 text-gray-200 group-hover:text-yellow-400 transition-colors">{item}</h3>
                 <p className="text-xs text-gray-500">Updated {i + 1} days ago</p>
              </div>
           ))}
        </div>
      </div>
    </div>
  )
}