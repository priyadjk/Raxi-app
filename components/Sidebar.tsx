import React from 'react';
import { Icons } from '../constants';
import { resetChat } from '../services/geminiService';
import { AuthMode } from './AuthModal';

export type View = 'chat' | 'search' | 'library' | 'projects';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewChat: () => void;
  isLoggedIn: boolean;
  onAuth: (mode: AuthMode) => void;
  onLogout: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  onNewChat, 
  isLoggedIn,
  onAuth,
  onLogout,
  currentView,
  onViewChange
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:relative z-40 top-0 left-0 h-full bg-[#000000] border-r border-gray-800
        transform transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? 'w-[260px] translate-x-0' : '-translate-x-full w-0 md:w-0 md:translate-x-0 md:overflow-hidden'}
      `}>
        {/* Header: Logo and Close Button */}
        <div className="p-4 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('chat')}>
               <span className="text-xl font-bold text-gray-100 tracking-tight">Raxi</span>
               <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
           </div>
           <button 
             onClick={() => setIsOpen(false)}
             className="text-gray-500 hover:text-yellow-400 transition-colors p-1 rounded-md hover:bg-white/5"
             title="Close sidebar"
           >
              <Icons.PanelLeftClose />
           </button>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-2 space-y-1">
            <button 
                onClick={() => {
                    onNewChat();
                    onViewChange('chat');
                    if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    currentView === 'chat' 
                    ? 'bg-[#1a1a1e] text-yellow-400' 
                    : 'text-gray-300 hover:bg-[#1a1a1e] hover:text-yellow-400'
                }`}
            >
                <span className={`${currentView === 'chat' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`}>
                    <Icons.Plus />
                </span>
                <span className="font-medium text-sm">New chat</span>
            </button>
            
            <button 
                onClick={() => {
                    onViewChange('search');
                    if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    currentView === 'search' 
                    ? 'bg-[#1a1a1e] text-yellow-400' 
                    : 'text-gray-300 hover:bg-[#1a1a1e] hover:text-yellow-400'
                }`}
            >
                 <span className={`${currentView === 'search' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`}>
                    <Icons.Search />
                </span>
                <span className="font-medium text-sm">Search</span>
            </button>

            <button 
                onClick={() => {
                    onViewChange('library');
                    if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    currentView === 'library' 
                    ? 'bg-[#1a1a1e] text-yellow-400' 
                    : 'text-gray-300 hover:bg-[#1a1a1e] hover:text-yellow-400'
                }`}
            >
                 <span className={`${currentView === 'library' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`}>
                    <Icons.Library />
                </span>
                <span className="font-medium text-sm">Library</span>
            </button>

            <button 
                onClick={() => {
                    onViewChange('projects');
                    if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    currentView === 'projects' 
                    ? 'bg-[#1a1a1e] text-yellow-400' 
                    : 'text-gray-300 hover:bg-[#1a1a1e] hover:text-yellow-400'
                }`}
            >
                 <span className={`${currentView === 'projects' ? 'text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`}>
                    <Icons.Folder />
                </span>
                <span className="font-medium text-sm">Projects</span>
            </button>
        </div>

        {/* Separator */}
        <div className="my-2 border-t border-gray-800 mx-4" />

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
            <div className="space-y-1">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Today</h3>
                {['Quantum Physics Basics', 'React Component Help', 'Recipe for Tacos'].map((title, i) => (
                    <button 
                        key={i} 
                        onClick={() => onViewChange('chat')}
                        className="group w-full flex items-center justify-between text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-[#1a1a1e] rounded-lg transition-colors truncate"
                    >
                        <span className="truncate group-hover:text-yellow-50/80 transition-colors">{title}</span>
                    </button>
                ))}
            </div>
            
            <div className="space-y-1">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Yesterday</h3>
                {['Python Debugging', 'Travel Itinerary'].map((title, i) => (
                    <button 
                        key={i} 
                        onClick={() => onViewChange('chat')}
                        className="group w-full flex items-center justify-between text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-[#1a1a1e] rounded-lg transition-colors truncate"
                    >
                        <span className="truncate group-hover:text-yellow-50/80 transition-colors">{title}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Auth / Profile Section */}
        <div className="p-4 border-t border-gray-800 bg-black">
          {isLoggedIn ? (
            <div className="space-y-2">
                 {/* Settings Button (visible when logged in) */}
                 <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-400 hover:text-yellow-400 hover:bg-[#1a1a1e] rounded-lg transition-colors">
                    <Icons.Settings />
                    <span>Settings</span>
                 </button>

                {/* Profile Card */}
                <div className="flex items-center gap-3 w-full px-2 py-2 hover:bg-[#1a1a1e] rounded-lg transition-colors text-left group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black shadow-lg">
                        JD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-200 group-hover:text-yellow-400 transition-colors truncate">John Doe</p>
                        <p className="text-[10px] text-gray-500 truncate">Pro Plan</p>
                    </div>
                    <button onClick={onLogout} className="text-gray-500 hover:text-white transition-colors" title="Log out">
                        <Icons.Logout />
                    </button>
                </div>
            </div>
          ) : (
            <div className="space-y-3">
                 <button 
                    onClick={() => onAuth('signup')}
                    className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-yellow-400/20"
                  >
                    Sign up
                  </button>
                  <button 
                    onClick={() => onAuth('login')}
                    className="w-full py-2.5 px-4 bg-[#1a1a1e] hover:bg-[#25252a] text-yellow-400 text-sm font-medium rounded-lg transition-all border border-gray-800 hover:border-gray-700"
                  >
                    Log in
                  </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};