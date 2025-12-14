import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { resetChat } from './services/geminiService';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0); // Used to force re-mount/reset of ChatArea
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNewChat = () => {
    resetChat();
    setChatKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] text-gray-100 font-sans">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onNewChat={handleNewChat}
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <main className="flex-1 h-full relative flex flex-col min-w-0">
        <ChatArea 
            key={chatKey}
            sidebarOpen={sidebarOpen} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
      </main>
    </div>
  );
};

export default App;