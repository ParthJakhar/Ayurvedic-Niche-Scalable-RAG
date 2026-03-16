import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useAyurvedicChat } from "@/hooks/useAyurvedicChat";

const suggestions = [
  "How to balance Vata in winter?",
  "Best foods for a Pitta constitution?",
  "Morning routine for Kapha types",
  "What is Panchakarma therapy?",
];

const Index = () => {
  const { messages, input, setInput, sendMessage, isSending } =
    useAyurvedicChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/90 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
            AyurAI
          </h1>
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-2 h-2 rounded-full bg-forest animate-pulse-dot" />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-[800px] mx-auto pb-36">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center min-h-[65vh] px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-8 shadow-lg"
              >
                <Leaf className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
                Ancient wisdom,
                <br />
                modern clarity.
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mb-10 leading-relaxed">
                Your personal Ayurvedic consultant — ask about doshas,
                nutrition, herbal remedies, or daily routines tailored to your
                constitution.
              </p>

              <div className="flex flex-wrap gap-2.5 justify-center max-w-lg">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => {
                      setInput(s);
                    }}
                    className="group flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-full border border-border bg-card hover:border-gold hover:shadow-[var(--shadow-sm)] text-foreground transition-all duration-200"
                  >
                    <Sparkles className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="pt-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        disabled={isSending}
      />
    </div>
  );
};

export default Index;
