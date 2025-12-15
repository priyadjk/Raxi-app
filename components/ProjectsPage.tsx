import React from 'react';
import { Icons } from '../constants';

export const ProjectsPage = () => {
  return (
    <div className="flex-1 h-full bg-[#212121] text-gray-100 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto pt-10">
         <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400"><Icons.Folder /></span>
                Projects
            </h1>
            <button className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2">
                <Icons.Plus /> New Project
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example Active Project */}
             <div className="p-6 bg-[#1a1a1e] border border-gray-800 rounded-2xl hover:border-yellow-400/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                        R
                     </div>
                     <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Active</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">Raxi App Launch</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">Coordination for the upcoming product launch, including marketing assets and development milestones.</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>12 files</span>
                    <span>Last edited today</span>
                </div>
             </div>

              {/* Empty State / Placeholder */}
             <div className="p-6 bg-[#1a1a1e] border border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-[#202025] transition-colors cursor-pointer min-h-[200px]">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 text-gray-500">
                    <Icons.Plus />
                </div>
                <h3 className="text-lg font-medium mb-1">Create new project</h3>
             </div>
         </div>
      </div>
    </div>
  )
}