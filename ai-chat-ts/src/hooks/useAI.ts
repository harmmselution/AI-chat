import { useState } from "react";
import type { ChatMessage } from "../types/chat";

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "meta-llama/Llama-3.2-3B-Instruct";

interface HFResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

export const useAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content }
    ];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch(HF_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: updatedMessages
        })
      });

      const data: HFResponse = await response.json();

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content ?? "No response"
      };

      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};