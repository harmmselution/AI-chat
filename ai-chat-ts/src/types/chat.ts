export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export interface ChatThread {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}