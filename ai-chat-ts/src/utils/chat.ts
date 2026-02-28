import type { ChatMessage, Role } from "../types/chat";
import type { HFResponse } from "../types/api";

export const createMessage = (
  role: Role,
  content: string
): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
});

export const getResponseErrorMessage = async (
  response: Response
): Promise<string> => {
  try {
    const data = (await response.json()) as HFResponse;
    return data.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};
