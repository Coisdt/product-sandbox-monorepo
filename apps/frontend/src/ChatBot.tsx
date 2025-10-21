import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CarRecommendationCard from './CarRecommendationCard';

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
        console.log('🔧 Tool call:', call.toolCall);
        if (call.toolCall.toolName === 'recommendCar') {
          console.log('🔧 Tool call:', call.toolCall);
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

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999,
          opacity: isClosing ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={isClosing ? 'sidebar-exit' : 'sidebar-enter'}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '480px',
          maxWidth: '90vw',
          height: '100vh',
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '2rem 2rem 1.5rem',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                🤖
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                  }}
                >
                  AI Assistant
                </h3>
                {isLoading && (
                  <span
                    style={{
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Thinking...
                  </span>
                )}
              </div>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
              }}
            >
              Ask me anything about cars, get recommendations, or chat about
              anything else!
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              marginTop: '-0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: '1.5rem 2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {messages.map(({ id, role, content, parts }) => (
            <div
              key={id}
              style={{
                display: 'flex',
                justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              {role === 'assistant' && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    flexShrink: 0,
                    marginTop: '0.25rem',
                  }}
                >
                  🤖
                </div>
              )}
              <div
                style={{
                  maxWidth: role === 'user' ? '85%' : '90%',
                  padding: '1rem 1.25rem',
                  borderRadius:
                    role === 'user'
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                  backgroundColor:
                    role === 'user'
                      ? 'var(--accent-primary)'
                      : 'var(--bg-secondary)',
                  color: role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  border:
                    role === 'assistant'
                      ? '1px solid var(--border-primary)'
                      : 'none',
                  boxShadow:
                    role === 'user'
                      ? '0 2px 8px rgba(34, 197, 94, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                {role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      // Style the markdown components
                      p: ({ children }) => (
                        <p
                          style={{
                            margin: '0 0 0.75rem 0',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong
                          style={{
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em
                          style={{
                            fontStyle: 'italic',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {children}
                        </em>
                      ),
                      ul: ({ children }) => (
                        <ul
                          style={{
                            margin: '0.75rem 0',
                            paddingLeft: '1.5rem',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{
                            margin: '0.75rem 0',
                            paddingLeft: '1.5rem',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li
                          style={{
                            marginBottom: '0.5rem',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {children}
                        </li>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--accent-primary)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontFamily: 'JetBrains Mono, Consolas, monospace',
                            fontWeight: '500',
                          }}
                        >
                          {children}
                        </code>
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
                    // Handle recommendCar tool calls with the car card component
                    if (toolCall.toolInvocation.toolName === 'recommendCar') {
                      const carId = toolCall.toolInvocation.args?.carId;
                      return (
                        <div key={toolCall.toolInvocation.toolName}>
                          {carId ? (
                            <CarRecommendationCard carId={carId} />
                          ) : (
                            <div
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                marginTop: '0.5rem',
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                              }}
                            >
                              <strong>Error:</strong> No car ID provided in tool
                              call arguments
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Handle other tool calls with the generic display
                    // return (
                    //   <div key={toolCall.toolInvocation.toolName}>
                    //     <div
                    //       style={{
                    //         backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    //         padding: '0.5rem',
                    //         borderRadius: '8px',
                    //         marginTop: '0.5rem',
                    //         fontSize: '0.8rem',
                    //         fontFamily: 'monospace',
                    //       }}
                    //     >
                    //       <strong>Tool Call:</strong>{' '}
                    //       {toolCall.toolInvocation.toolName}
                    //       <br />
                    //       <strong>Arguments:</strong>{' '}
                    //       {JSON.stringify(
                    //         toolCall.toolInvocation.args,
                    //         null,
                    //         2
                    //       )}
                    //     </div>
                    //   </div>
                    // );
                  })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  flexShrink: 0,
                  marginTop: '0.25rem',
                }}
              >
                🤖
              </div>
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '20px 20px 20px 4px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        animation: 'pulse 1.5s ease-in-out infinite 0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-primary)',
                        animation: 'pulse 1.5s ease-in-out infinite 0.4s',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                    }}
                  >
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--danger)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  flexShrink: 0,
                  marginTop: '0.25rem',
                }}
              >
                ⚠️
              </div>
              <div
                style={{
                  maxWidth: '90%',
                  padding: '1rem 1.25rem',
                  borderRadius: '20px 20px 20px 4px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--danger)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                }}
              >
                Sorry, I encountered an error. Please try again.
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: '1.5rem 2rem 2rem',
            borderTop: '1px solid var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about cars..."
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: isLoading
                      ? 'var(--bg-tertiary)'
                      : 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {input.trim() && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      pointerEvents: 'none',
                    }}
                  >
                    Press Enter ↵
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor:
                    !input.trim() || isLoading
                      ? 'var(--border-primary)'
                      : 'var(--accent-primary)',
                  color:
                    !input.trim() || isLoading ? 'var(--text-muted)' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor:
                    !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                  boxShadow:
                    !input.trim() || isLoading
                      ? 'none'
                      : '0 2px 8px rgba(34, 197, 94, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!(!input.trim() || isLoading)) {
                    e.currentTarget.style.backgroundColor =
                      'var(--accent-secondary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!input.trim() || isLoading)) {
                    e.currentTarget.style.backgroundColor =
                      'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
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
