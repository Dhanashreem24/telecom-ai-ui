import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Message } from "../types/chat";

interface MessageBubbleProps extends Message {
  isTyping?: boolean;
}

export default function MessageBubble({ role, content, timestamp, isTyping }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isAgent = role === "agent";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full mb-6 ${isAgent ? "justify-start" : "justify-end"}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isAgent ? "flex-row" : "flex-row-reverse"}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isAgent ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
          {isAgent ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`relative group p-4 rounded-2xl shadow-sm text-sm leading-relaxed
          ${isAgent 
            ? "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none" 
            : "bg-indigo-600 text-white rounded-tr-none"
          }`}>
          
          {isTyping ? (
             <div className="flex gap-1 h-5 items-center">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          ) : (
            <div className="whitespace-pre-wrap">{content}</div>
          )}

          {/* Timestamp & Copy (Only show on hover or for agent) */}
          <div className={`flex items-center gap-2 mt-2 text-xs opacity-70 
            ${isAgent ? "justify-start" : "justify-end text-indigo-100"}`}>
            <span>{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            
            {!isTyping && isAgent && (
              <button 
                onClick={handleCopy} 
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-500"
                title="Copy text"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}