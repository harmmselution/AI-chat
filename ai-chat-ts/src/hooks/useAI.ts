import { useState } from "react";
import { toast } from "react-hot-toast";
import type { ChatMessage } from "../types/chat";
import { getErrorMessage, type AppError } from "../utils/error";

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "meta-llama/Llama-3.2-3B-Instruct";

interface HFResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  error?: string;
}

const createMessage = (
  role: "user" | "assistant",
  content: string
): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
});

export const useAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      createMessage("user", content),
    ];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch(HF_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: updatedMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data: HFResponse = await response.json();

      if (!response.ok) {
        const apiError: AppError = {
          message: data.error || "Failed to get AI response.",
          status: response.status,
        };

        throw apiError;
      }

      const aiMessage = createMessage(
        "assistant",
        data.choices?.[0]?.message?.content ?? "No response"
      );

      setMessages([...updatedMessages, aiMessage]);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};