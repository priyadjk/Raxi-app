import React, { useState, useRef, useEffect } from 'react';
import { Message, Source } from '../types';
import { sendMessageStream, resetChat } from '../services/geminiService';
import { Icons } from '../constants';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceList } from './SourceList';

interface ChatAreaProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AVAILABLE_MODELS = [
  { id: 'gemini', name: 'Gemini 2.5 Flash', description: 'Fast, efficient, and grounded' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'OpenAI flagship model' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', description: 'Anthropic\'s most intelligent model' },
  { id: 'perplexity', name: 'Perplexity Pro', description: 'Optimized for deep research' },
];

export const ChatArea: React.FC<ChatAreaProps> = ({ sidebarOpen, toggleSidebar }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }

    const aiMessageId = (Date.now() + 1).toString();
    // Placeholder for AI message
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'model',
      content: '',
      isStreaming: true,
      sources: []
    }]);

    await sendMessageStream(userMessage.content, {
      onChunk: (text) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: msg.content + text }
            : msg
        ));
      },
      onSources: (sources) => {
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, sources: [...(msg.sources || []), ...sources] }
              : msg
          ));
      },
      onComplete: () => {
        setIsLoading(false);
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        ));
      },
      onError: (err) => {
        setIsLoading(false);
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: msg.content + "\n\n*[Error generating response. Please try again.]*", isStreaming: false }
              : msg
          ));
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative bg-[#212121]">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#212121]/90 backdrop-blur-md">
        <div className="flex items-center gap-3" ref={dropdownRef}>
             <button onClick={toggleSidebar} className="text-gray-400 hover:text-white md:hidden">
              <Icons.Menu />
            </button>
            <div className="relative">
                <button 
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-colors group"
                >
                    <span className="font-medium text-gray-200 group-hover:text-yellow-400 transition-colors">{selectedModel.name}</span>
                    {selectedModel.id === 'gemini' && <span className="text-gray-500 text-xs px-1.5 py-0.5 border border-gray-700 rounded bg-[#1a1a1e]">Beta</span>}
                    <svg className={`w-3 h-3 text-gray-500 group-hover:text-yellow-400 transition-all duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Model Dropdown */}
                {isModelDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-[#1a1a1e] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-1.5 space-y-0.5">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                            selectedModel.id === model.id 
                            ? 'bg-yellow-400/10 text-yellow-400' 
                            : 'text-gray-300 hover:bg-white/5 hover:text-gray-100'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{model.name}</span>
                            <span className={`text-[10px] ${selectedModel.id === model.id ? 'text-yellow-400/70' : 'text-gray-500'}`}>{model.description}</span>
                          </div>
                          {selectedModel.id === model.id && (
                             <Icons.Check />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Share chat">
                <Icons.Share />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationFillMode: 'forwards' }}>
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/10">
                   <Icons.Sparkles />
               </div>
               <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">How can I help you today?</h1>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10 w-full max-w-lg">
                   {["What's the latest in quantum computing?", "Explain the plot of Dune Part 2", "Write a python script to scrape a website", "Compare React vs Vue in 2025"].map((suggestion, i) => (
                       <button 
                         key={i} 
                         onClick={() => { setInput(suggestion); if(textareaRef.current) textareaRef.current.focus(); }}
                         className="text-sm bg-[#303030] border border-transparent hover:border-gray-600 p-3 rounded-xl text-gray-200 hover:bg-[#3a3a3a] transition-all text-left"
                        >
                            {suggestion}
                       </button>
                   ))}
               </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'justify-end' : ''}`}>
               {/* Avatar */}
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.Sparkles />
                </div>
              )}
              
              <div className={`flex flex-col max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* User Message Bubble */}
                {msg.role === 'user' ? (
                     <div className="bg-[#303030] text-gray-100 px-4 py-2.5 rounded-2xl rounded-tr-sm">
                        <p className="whitespace-pre-wrap leading-7">{msg.content}</p>
                     </div>
                ) : (
                    // Model Message Area
                    <div className="w-full">
                        <div className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            {selectedModel.name.split(' ')[0]}
                            {msg.isStreaming && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>}
                        </div>
                        <MarkdownRenderer content={msg.content} />
                        <SourceList sources={msg.sources || []} />
                    </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
            {/* Action Bar (Optional buttons above input) */}
            {isLoading && (
                 <div className="flex justify-center mb-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#303030] border border-gray-600 rounded-full text-xs text-gray-300 hover:text-white transition-colors">
                        <Icons.Stop /> Stop generating
                    </button>
                 </div>
            )}

          <div className="relative group bg-[#303030] border border-gray-600/50 focus-within:border-gray-500 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${selectedModel.name}...`}
              className="w-full max-h-[200px] py-4 pl-4 pr-12 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none leading-relaxed custom-scrollbar"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 
                ${input.trim() && !isLoading 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
              <Icons.Send />
            </button>
          </div>
          <div className="text-center mt-3">
             <p className="text-[11px] text-gray-500">Raxi Chat can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
    </div>
  );
};