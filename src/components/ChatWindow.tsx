import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Menu, Moon, Sun } from "lucide-react";

import type { Message, Session } from "../types/chat";
import { sendMessage } from "../services/api";
import { useTTS } from "../hooks/useTTS";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";

// Mock Data for Sessions
const MOCK_SESSIONS: Session[] = [
  { id: "1", title: "Billing Issue Resolved", date: "2023-10-01" },
  { id: "2", title: "Internet Upgrade Info", date: "2023-10-05" },
  { id: "3", title: "Payment Failed", date: "2023-10-12" },
];

export default function ChatWindow() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { speak } = useTTS(ttsEnabled);

  // Effects
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handlers
  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    // In a real app, you might generate a new ID here
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    // Simulate fetching history:
    setMessages([
      { role: "user", content: "Previous message from history...", timestamp: new Date() },
      { role: "agent", content: "I recall that. How can I help now?", timestamp: new Date() }
    ]);
  };

  async function handleSend(text: string) {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    // If this is the first message, create a session title (Mock logic)
    if (!currentSessionId) {
       const newId = Date.now().toString();
       const newSession = { id: newId, title: text.slice(0, 30) + "...", date: new Date().toISOString() };
       setSessions(prev => [newSession, ...prev]);
       setCurrentSessionId(newId);
    }

    try {
      const replyText = await sendMessage(text, "local_tester");
      
      const agentMsg: Message = { role: "agent", content: replyText, timestamp: new Date() };
      setMessages((m) => [...m, agentMsg]);

      // Speak
      // Simple heuristic: Speak after a small delay to feel natural
      setTimeout(() => speak(replyText), 500);

    } catch {
      const errorMsg: Message = { 
        role: "agent", 
        content: "Sorry, I encountered a connection error.", 
        timestamp: new Date() 
      };
      setMessages((m) => [...m, errorMsg]);
      speak("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
      
      {/* 1. LEFT SIDEBAR */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
      />

      {/* 2. MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu size={20} className="dark:text-white" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="font-semibold text-gray-800 dark:text-white">Telecom Assistant</h1>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-full transition-colors 
                ${ttsEnabled 
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              title="Toggle Text-to-Speech"
            >
              {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
            >
              {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-gray-50/50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Empty State */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full animate-ping absolute opacity-20" />
                  <Volume2 className="text-indigo-600 dark:text-indigo-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-500 max-w-md">
                  Ask me about your internet bill, data usage, or connectivity issues.
                </p>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg, i) => (
              <MessageBubble key={i} {...msg} />
            ))}

            {/* Loading / Typing Indicator */}
            {loading && (
              <MessageBubble 
                role="agent" 
                content="" 
                timestamp={new Date()} 
                isTyping={true}
              />
            )}
            
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Footer / Input */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={loading} />
            <p className="text-xs text-center text-gray-400 mt-2">
              AI can make mistakes. Please verify important billing details.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}