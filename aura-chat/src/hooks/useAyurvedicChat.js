import { useState, useCallback, useRef } from "react";

const API_BASE = "http://localhost:8010";

const USER_ID_KEY = "ayur_user_id";

function getOrCreateUserId() {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `user-${Date.now()}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

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
      const userId = getOrCreateUserId();
      const res = await fetch(
        `${API_BASE}/chat?query=${encodeURIComponent(trimmed)}&user_id=${encodeURIComponent(userId)}`,
        {
          method: "POST",
        },
      );
<<<<<<< HEAD
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.job_id) {
        throw new Error(data.detail || data.message || "Chat request failed");
=======
      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.status}`);
      }
      const data = await res.json();
      if (!data?.job_id) {
        throw new Error("Missing job_id in chat response");
>>>>>>> 21a29075ba8e17099aadcd3073689d307c84b479
      }
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
