import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Leaf, AlertCircle } from "lucide-react";

const LoadingDots = () => (
  <div className="flex items-center gap-1.5 py-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full bg-primary/40"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const MessageSkeleton = () => (
  <div className="flex items-start gap-3.5">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
      <Leaf className="w-4 h-4 text-primary-foreground" />
    </div>
    <div className="flex-1 py-1">
      <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
        Consulting ancient texts...
      </p>
      <LoadingDots />
    </div>
  </div>
);

const messageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const ChatMessage = memo(({ message }) => {
  const isUser = message.role === "user";
  const isLoading = message.status === "queued" || message.status === "pending";
  const isFailed = message.status === "failed";

  if (!isUser && isLoading) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 md:px-6 py-5"
      >
        <MessageSkeleton />
      </motion.div>
    );
  }

  if (isUser) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-end px-5 md:px-6 py-2.5"
      >
        <div className="bg-card text-foreground rounded-2xl rounded-tr-md px-5 py-3.5 max-w-[80%] text-sm leading-relaxed border border-border shadow-[var(--shadow-card)]">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-5 md:px-6 py-5"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          {isFailed ? (
            <AlertCircle className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Leaf className="w-4 h-4 text-primary-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {isFailed ? (
            <div className="bg-destructive/5 border border-destructive/15 rounded-xl px-4 py-3">
              <p className="text-sm text-destructive">{message.content}</p>
            </div>
          ) : (
            <div className="bg-sage-bg rounded-2xl rounded-tl-md px-5 py-4">
              <div className="ai-prose text-sm text-foreground">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
