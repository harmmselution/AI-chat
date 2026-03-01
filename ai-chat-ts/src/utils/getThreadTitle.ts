import type { ChatThread } from "../types/chat";

const PREVIEW_LENGTH = 48;

const getThreadTitle = (thread: ChatThread): string => {
  const firstUser = thread.messages.find((m) => m.role === "user");
  if (!firstUser?.content.trim()) return "New chat";
  const trimmed = firstUser.content.trim();
  return trimmed.length <= PREVIEW_LENGTH
    ? trimmed
    : `${trimmed.slice(0, PREVIEW_LENGTH)}…`;
};

export {getThreadTitle}