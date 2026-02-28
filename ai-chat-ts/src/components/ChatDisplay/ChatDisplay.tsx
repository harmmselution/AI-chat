import classNames from "classnames";
import type { ChatMessage } from "../../types/chat";
import styles from "./ChatDisplay.module.scss";
import { Loader } from "../Loader/Loader";

interface ChatDisplayProps {
  messages: ChatMessage[];
  loading: boolean;
}

export const ChatDisplay = ({ messages, loading }: ChatDisplayProps) => {
  return (
    <div className={styles.wrapper}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={classNames(styles.message, styles[message.role])}
        >
          {message.content}
        </div>
      ))}

      {loading && (
        <div className={classNames(styles.message, styles.assistant, styles.loading)}>
          <Loader />
        </div>
      )}
    </div>
  );
};

