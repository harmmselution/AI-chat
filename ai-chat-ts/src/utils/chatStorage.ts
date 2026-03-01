import type { ChatMessage, ChatThread } from "../types/chat";

const CHAT_STORAGE_KEY = "ai-chat-history";
const LEGACY_STORAGE_KEY = "ai-chat-history";

interface StoredState {
  threads: ChatThread[];
  activeThreadId: string;
}

const createEmptyThread = (): ChatThread => ({
  id: crypto.randomUUID(),
  messages: [],
  createdAt: Date.now(),
});

const loadRaw = (): StoredState | null => {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredState;
  
};

const saveState = (state: StoredState) => localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
  

const migrateFromLegacy = (): StoredState => {
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) {
      const thread = createEmptyThread();
      const state: StoredState = { threads: [thread], activeThreadId: thread.id };
      saveState(state);
      return state;
    }
    const parsed = JSON.parse(legacy);
    if (!Array.isArray(parsed)) {
      const thread = createEmptyThread();
      const state: StoredState = { threads: [thread], activeThreadId: thread.id };
      saveState(state);
      return state;
    }
    const messages = parsed as ChatMessage[];
    if (messages.length === 0) {
      const thread = createEmptyThread();
      const state: StoredState = { threads: [thread], activeThreadId: thread.id };
      saveState(state);
      return state;
    }
    const thread: ChatThread = {
      id: crypto.randomUUID(),
      messages,
      createdAt: Date.now(),
    };
    const state: StoredState = { threads: [thread], activeThreadId: thread.id };
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return state;
  } catch {
    const thread = createEmptyThread();
    const state: StoredState = { threads: [thread], activeThreadId: thread.id };
    saveState(state);
    return state;
  }
};

const getState = (): StoredState => {
  const state = loadRaw();
  if (state?.threads?.length) {
    const activeId =
      state.activeThreadId &&
      state.threads.some((t) => t.id === state.activeThreadId)
        ? state.activeThreadId
        : state.threads[0].id;
    return { threads: state.threads, activeThreadId: activeId };
  }
  if (state) {
    const thread = createEmptyThread();
    return {
      threads: [thread],
      activeThreadId: thread.id,
    };
  }
  return migrateFromLegacy();
};

 const loadChatHistory = (): ChatMessage[] => {
  const state = getState();
  const thread = state.threads.find((t) => t.id === state.activeThreadId);
  return thread?.messages ?? [];
};

 const getActiveThreadId = (): string => {
  const state = getState();
  return state.activeThreadId || state.threads[0]?.id || createEmptyThread().id;
};

 const saveChatHistory = (messages: ChatMessage[]) => {
  const state = getState();
  const id = state.activeThreadId || createEmptyThread().id;
  let threads = state.threads.filter((t) => t.id !== id);
  const existing = state.threads.find((t) => t.id === id);
  threads.push({
    id,
    messages,
    createdAt: existing?.createdAt ?? Date.now(),
  });
  threads = threads.sort((a, b) => b.createdAt - a.createdAt);
  saveState({ threads, activeThreadId: id });
};

 const clearCurrentThread = (): string => {
  const state = getState();
  const newThread = createEmptyThread();
  const current = state.threads.find((t) => t.id === state.activeThreadId);
  const hasMessages = (current?.messages.length ?? 0) > 0;
  const threads = hasMessages
    ? [...state.threads, newThread]
    : state.threads.map((t) =>
        t.id === state.activeThreadId ? newThread : t
      );
  saveState({
    threads: threads.sort((a, b) => b.createdAt - a.createdAt),
    activeThreadId: newThread.id,
  });
  return newThread.id;
};

 const getThreads = (): ChatThread[] => {
  const state = getState();
  return (state.threads || []).sort((a, b) => b.createdAt - a.createdAt);
};

 const loadThread = (threadId: string): ChatMessage[] => {
  const state = getState();
  const thread = state.threads.find((t) => t.id === threadId);
  if (!thread) return loadChatHistory();
  saveState({ ...state, activeThreadId: threadId });
  return thread.messages;
};

 const clearAllHistory = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
};

export {clearAllHistory, loadThread, getThreads, clearCurrentThread,saveChatHistory, getActiveThreadId, loadChatHistory}