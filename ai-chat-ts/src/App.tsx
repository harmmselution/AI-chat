import { useState, type FormEvent } from "react";
import { useAI } from "./hooks/useAI";
import styles from "./App.module.scss";
import { Input } from "./components/Input/Input";
import { Button } from "./components/Button/Button";
import { ChatDisplay } from "./components/ChatDisplay/ChatDisplay";
import { ChatHistory } from "./components/ChatHistory/ChatHistory";

export const App = () => {
  const [value, setValue] = useState("");
  const { messages, sendMessage, loading, stopStreaming, clearMessages, threads, activeThreadId, switchToThread, clearAllHistory } =
    useAI();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue || loading) return;

    await sendMessage(trimmedValue);
    setValue("");
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
          <ChatHistory
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={switchToThread}
            onClearHistory={clearAllHistory}
          />

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>AI Assistant</h1>
          </div>

          <ChatDisplay messages={messages} loading={loading} />

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Ask something..."
              disabled={loading}
            />

            {loading ? (
              <Button type="button" variant="secondary" onClick={stopStreaming}>
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!value.trim()}>
                Send
              </Button>
            )}
            {messages.length > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={clearMessages}
                  disabled={loading}
                >
                  Clear
                </Button>
              )}
          </form>
        </section>
      </div>
    </main>
  );
};

