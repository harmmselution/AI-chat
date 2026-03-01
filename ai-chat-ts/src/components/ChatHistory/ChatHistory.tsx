import type { ChatThread } from "../../types/chat";
import { formatDate } from "../../utils/formatDate";
import { getThreadTitle } from "../../utils/getThreadTitle";
import styles from "./ChatHistory.module.scss";

interface ChatHistoryProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onClearHistory?: () => void;
}

export const ChatHistory = ({
  threads,
  activeThreadId,
  onSelectThread,
  onClearHistory,
}: ChatHistoryProps) => {
  return (
    <aside className={styles.sidebar} aria-label="Chat history">
      <div className={styles.header}>
        <h2 className={styles.title}>History</h2>
        {onClearHistory && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClearHistory}
            aria-label="Clear all history"
          >
            Clear history
          </button>
        )}
      </div>
      <ul className={styles.list}>
        {threads.length === 0 ? (
          <li className={styles.empty}>No conversations yet</li>
        ) : (
          threads.map((thread) => (
            <li key={thread.id}>
              <button
                type="button"
                className={styles.threadItem}
                data-active={thread.id === activeThreadId || undefined}
                onClick={() => onSelectThread(thread.id)}
              >
                <span className={styles.threadTitle}>
                  {getThreadTitle(thread)}
                </span>
                <span className={styles.threadDate}>
                  {formatDate(thread.createdAt)}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};
