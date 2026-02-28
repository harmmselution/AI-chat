import { useRef, useState } from "react";
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

interface HFStreamChunk {
  choices?: Array<{
    delta?: {
      role?: "assistant";
      content?: string;
    };
    finish_reason?: string | null;
  }>;
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

const getResponseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as HFResponse;
    return data.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

export const useAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setLoading(false);
  };

  const clearMessages = () => {
    stopStreaming();
    setMessages([]);
  };

  const sendMessage = async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent || loading) return;

    const userMessage = createMessage("user", trimmedContent);
    const assistantMessage = createMessage("assistant", "");

    const updatedMessages = [...messages, userMessage, assistantMessage];

    setMessages(updatedMessages);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(HF_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          stream: true,
          messages: updatedMessages
            .filter((message) => message.id !== assistantMessage.id)
            .map(({ role, content }) => ({
              role,
              content,
            })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const apiError: AppError = {
          message: await getResponseErrorMessage(response),
          status: response.status,
        };

        throw apiError;
      }

      if (!response.body) {
        throw new Error("Streaming response body is missing.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const lines = event
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s?/, "").trim())
            .filter(Boolean);

          for (const line of lines) {
            if (line === "[DONE]") {
              continue;
            }

            const chunk = JSON.parse(line) as HFStreamChunk;
            const delta = chunk.choices?.[0]?.delta?.content;

            if (!delta) continue;

            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessage.id
                  ? { ...message, content: message.content + delta }
                  : message
              )
            );
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      toast.error(getErrorMessage(error));

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== assistantMessage.id)
      );
  
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  };
  

  return {
    messages,
    sendMessage,
    loading,
    stopStreaming,
    clearMessages,
  };
};