import { Plus, MessageSquare, X } from "lucide-react";
import type { Session } from "../types/chat";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat 
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          
          {/* Header / New Chat */}
          <div className="p-4">
            <button 
              onClick={() => { onNewChat(); onClose(); }} // Close sidebar on mobile when clicked
              className="flex items-center justify-center w-full gap-2 px-4 py-3 
                bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm font-medium"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2 tracking-wider">
              Recent Chats
            </div>
            
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => { onSelectSession(session.id); onClose(); }}
                className={`flex items-center gap-3 w-full px-3 py-3 text-sm rounded-lg transition text-left truncate
                  ${currentSessionId === session.id 
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
              >
                <MessageSquare size={16} />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>

          {/* Footer (Optional: User Profile) */}
          <div className="p-4 border-t dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500" />
              <div className="text-sm">
                <p className="font-medium dark:text-gray-200">User Account</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-[-40px] md:hidden bg-white p-2 rounded-r-md shadow-md"
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
}