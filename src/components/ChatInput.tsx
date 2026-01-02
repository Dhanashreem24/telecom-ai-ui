import { useState } from "react";
import { Mic, Send, Square } from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const { start, stop, listening } = useSpeech(onSend); // Assuming stop exists, if not remove it

  function handleSend() {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="relative flex items-end gap-2 p-2 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-inner focus-within:ring-2 ring-indigo-500/20 transition-all">
      
      {/* Mic Button */}
      <button
        onClick={listening ? stop : start}
        className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0
          ${listening
            ? "bg-red-500 text-white animate-pulse shadow-red-500/20 shadow-lg"
            : "text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:text-indigo-600"
          }`}
        title="Voice Input"
      >
        {listening ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
      </button>

      {/* Text Area (Auto-growing style via css or simple input) */}
      <input
        className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-400 py-3 px-2 text-base"
        placeholder={listening ? "Listening..." : "Type your message..."}
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0
          ${text.trim() && !disabled
            ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-105" 
            : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
      >
        <Send size={20} />
      </button>
    </div>
  );
}