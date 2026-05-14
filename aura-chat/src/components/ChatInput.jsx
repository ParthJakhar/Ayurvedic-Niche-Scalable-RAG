import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ input, setInput, onSend, disabled }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-6 pt-4 px-4 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="max-w-[800px] mx-auto pointer-events-auto">
        <div className="relative flex items-end bg-card/80 backdrop-blur-xl rounded-full border border-border shadow-[var(--shadow-md)] p-1.5 transition-all duration-300 focus-within:border-primary/20 focus-within:shadow-[var(--shadow-lg)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your Dosha, diet, or remedies..."
            rows={1}
            className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground resize-none font-sans leading-relaxed max-h-[140px]"
          />

          <button
            onClick={onSend}
            disabled={disabled || !input.trim()}
            className="bg-primary text-primary-foreground w-10 h-10 rounded-full hover:bg-forest-hover transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
