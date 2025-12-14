import React from 'react';
import { Icons } from '../constants';
import { resetChat } from '../services/geminiService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewChat: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  onNewChat, 
  isLoggedIn,
  onLogin,
  onLogout 
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
        fixed md:relative z-40 top-0 left-0 h-full w-[260px] bg-[#000000] border-r border-gray-800
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header / New Chat */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-4 px-2 md:hidden">
             <span className="font-semibold text-gray-200">Menu</span>
             <button onClick={() => setIsOpen(false)} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <button 
            onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white transition-colors border border-white/5 group"
          >
            <div className="flex items-center gap-3">
                <div className="p-1 bg-white text-black rounded-full">
                    <Icons.Plus />
                </div>
                <span className="font-medium">New chat</span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Icons.Sparkles />
            </span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
            <div className="space-y-1">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Today</h3>
                {['Quantum Physics Basics', 'React Component Help', 'Recipe for Tacos'].map((title, i) => (
                    <button key={i} className="group w-full flex items-center justify-between text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-[#1a1a1e] rounded-lg transition-colors truncate">
                        <span className="truncate">{title}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                            <Icons.Trash />
                        </span>
                    </button>
                ))}
            </div>
            
            <div className="space-y-1">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Yesterday</h3>
                {['Python Debugging', 'Travel Itinerary'].map((title, i) => (
                    <button key={i} className="group w-full flex items-center justify-between text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-[#1a1a1e] rounded-lg transition-colors truncate">
                        <span className="truncate">{title}</span>
                         <span className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                            <Icons.Trash />
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-1">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Previous 7 Days</h3>
                 {['Marketing Strategy', 'Essay Outline', 'Email Drafts'].map((title, i) => (
                    <button key={i} className="group w-full flex items-center justify-between text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-[#1a1a1e] rounded-lg transition-colors truncate">
                        <span className="truncate">{title}</span>
                         <span className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                            <Icons.Trash />
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* Auth / Profile Section */}
        <div className="p-4 border-t border-gray-800 bg-black">
          {isLoggedIn ? (
            <div className="space-y-2">
                 {/* Settings Button (visible when logged in) */}
                 <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1e] rounded-lg transition-colors">
                    <Icons.Settings />
                    <span>Settings</span>
                 </button>

                {/* Profile Card */}
                <div className="flex items-center gap-3 w-full px-2 py-2 hover:bg-[#1a1a1e] rounded-lg transition-colors text-left group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-transparent group-hover:ring-gray-700">
                        JD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-200 truncate">John Doe</p>
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
                    onClick={onLogin}
                    className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Sign up
                  </button>
                  <button 
                    onClick={onLogin}
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