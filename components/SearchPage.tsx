import React from 'react';
import { Icons } from '../constants';

export const SearchPage = () => {
  return (
    <div className="flex-1 h-full bg-[#212121] text-gray-100 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400"><Icons.Search /></span>
          Search
        </h1>
        <div className="relative mb-10">
           <input
             type="text"
             placeholder="Search across your threads and knowledge..."
             className="w-full bg-[#303030] border border-gray-700 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-500"
             autoFocus
           />
           <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors">
             <Icons.Search />
           </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Searches</h2>
            <div className="space-y-2">
                {['Quantum Physics Basics', 'React Component Help', 'Dune Part 2 plot', 'Python Debugging'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-[#1a1a1e] rounded-lg cursor-pointer transition-colors group">
                        <span className="text-gray-500 group-hover:text-yellow-400"><Icons.Search /></span>
                        <span className="text-gray-300 group-hover:text-white">{item}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}