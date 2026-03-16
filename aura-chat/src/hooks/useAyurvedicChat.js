import { useState, useCallback, useRef } from "react";

const API_BASE = "http://localhost:8000";

export const useAyurvedicChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const intervalRefs = useRef(new Map());

  const updateMessage = useCallback((id, updates) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    );
  }, []);

  const pollJobStatus = useCallback(
    (jobId, messageId) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/job-status?job_id=${jobId}`);
          const data = await res.json();

          if (data.status === "completed") {
            clearInterval(interval);
            intervalRefs.current.delete(messageId);
            updateMessage(messageId, {
              content: data.result,
              status: "completed",
            });
          } else if (data.status === "failed") {
            clearInterval(interval);
            intervalRefs.current.delete(messageId);
            updateMessage(messageId, {
              status: "failed",
              content: data.error || "The oracle is silent. Please try again.",
            });
          }
        } catch (err) {
          // Just let it keep polling if there's a transient network error, don't kill it immediately
          console.error("Polling error:", err);
        }
      }, 1500);

      intervalRefs.current.set(messageId, interval);
    },
    [updateMessage],
  );

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    const userMsg = {
      id: userMsgId,
      role: "user",
      content: trimmed,
      status: "completed",
    };
    const aiMsg = { id: aiMsgId, role: "ai", content: "", status: "queued" };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(
        `${API_BASE}/chat?query=${encodeURIComponent(trimmed)}`,
        {
          method: "POST",
        },
      );
      const data = await res.json();
      updateMessage(aiMsgId, { status: "pending" });
      pollJobStatus(data.job_id, aiMsgId);
    } catch (err) {
      updateMessage(aiMsgId, {
        status: "failed",
        content: "Unable to send your question. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, updateMessage, pollJobStatus]);

  return { messages, input, setInput, sendMessage, isSending };
};
