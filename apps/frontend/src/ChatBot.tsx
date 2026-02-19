import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CarRecommendationCard from './CarRecommendationCard';
import styles from './ChatBot.module.css';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [isClosing, setIsClosing] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: 'http://localhost:3333/api/chat',
      initialMessages: [
        {
          id: '1',
          content: "Hello! I'm your AI assistant. How can I help you today?",
          role: 'assistant',
        },
      ],
      onToolCall: (call) => {
        if (call.toolCall.toolName === 'recommendCar') {
          return 'Handled by the UI';
        }
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  const isDisabled = !input.trim() || isLoading;

  return (
    <>
      <div
        className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ''}`}
        onClick={handleClose}
      />

      <div
        className={`${isClosing ? 'sidebar-exit' : 'sidebar-enter'} ${styles.sidebar}`}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitleRow}>
              <div className={styles.botAvatar}>🤖</div>
              <div>
                <h3 className={styles.headerTitle}>AI Assistant</h3>
                {isLoading && (
                  <span className={styles.thinkingLabel}>Thinking...</span>
                )}
              </div>
            </div>
            <p className={styles.headerSubtitle}>
              Ask me anything about cars, get recommendations, or chat about
              anything else!
            </p>
          </div>
          <button onClick={handleClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map(({ id, role, content, parts }) => (
            <div
              key={id}
              className={`${styles.messageRow} ${role === 'user' ? styles.messageRowUser : styles.messageRowAssistant}`}
            >
              {role === 'assistant' && (
                <div className={styles.messageAvatar}>🤖</div>
              )}
              <div
                className={role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAssistant}
              >
                {role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className={styles.mdParagraph}>{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className={styles.mdStrong}>{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className={styles.mdEm}>{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul className={styles.mdList}>{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className={styles.mdList}>{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className={styles.mdListItem}>{children}</li>
                      ),
                      code: ({ children }) => (
                        <code className={styles.mdCode}>{children}</code>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  content
                )}
                {parts
                  .filter((part) => part.type === 'tool-invocation')
                  .map((toolCall) => {
                    if (toolCall.toolInvocation.toolName === 'recommendCar') {
                      const carId = toolCall.toolInvocation.args?.carId;
                      return (
                        <div key={toolCall.toolInvocation.toolName}>
                          {carId ? (
                            <CarRecommendationCard carId={carId} />
                          ) : (
                            <div className={styles.toolError}>
                              <strong>Error:</strong> No car ID provided in tool
                              call arguments
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={styles.loadingRow}>
              <div className={styles.messageAvatar}>🤖</div>
              <div className={styles.loadingBubble}>
                <div className={styles.loadingDots}>
                  <div className={styles.dotsWrapper}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                  </div>
                  <span className={styles.loadingText}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorRow}>
              <div className={styles.errorAvatar}>⚠️</div>
              <div className={styles.errorBubble}>
                Sorry, I encountered an error. Please try again.
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about cars..."
                  disabled={isLoading}
                  className={`${styles.input} ${isLoading ? styles.inputDisabled : ''}`}
                />
                {input.trim() && (
                  <div className={styles.inputHint}>Press Enter ↵</div>
                )}
              </div>
              <button
                type="submit"
                disabled={isDisabled}
                className={`${styles.sendBtn} ${isDisabled ? styles.sendBtnDisabled : styles.sendBtnActive}`}
              >
                {isLoading ? (
                  <div className={styles.sendBtnSpinner}>
                    <div className={styles.spinner} />
                    <span>Send</span>
                  </div>
                ) : (
                  '📤 Send'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
