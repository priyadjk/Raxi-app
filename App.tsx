import React, { useState } from 'react';
import { Sidebar, View } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SearchPage } from './components/SearchPage';
import { LibraryPage } from './components/LibraryPage';
import { ProjectsPage } from './components/ProjectsPage';
import { AuthModal, AuthMode } from './components/AuthModal';
import { resetChat } from './services/geminiService';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatKey, setChatKey] = useState(0); // Used to force re-mount/reset of ChatArea
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('chat');
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleNewChat = () => {
    resetChat();
    setChatKey(prev => prev + 1);
  };

  const handleAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] text-gray-100 font-sans">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onNewChat={handleNewChat}
        isLoggedIn={isLoggedIn}
        onAuth={handleAuth}
        onLogout={() => setIsLoggedIn(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="flex-1 h-full relative flex flex-col min-w-0">
        {/* Chat Area - We hide it instead of unmounting to preserve state when switching tabs */}
        <div className={`flex-1 h-full flex flex-col ${currentView === 'chat' ? 'flex' : 'hidden'}`}>
            <ChatArea 
                key={chatKey}
                sidebarOpen={sidebarOpen} 
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            />
        </div>

        {/* Other Pages - Conditionally rendered */}
        {currentView === 'search' && <SearchPage />}
        {currentView === 'library' && <LibraryPage />}
        {currentView === 'projects' && <ProjectsPage />}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        initialMode={authMode}
      />
    </div>
  );
};

export default App;