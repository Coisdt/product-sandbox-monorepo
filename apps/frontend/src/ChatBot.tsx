import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CarRecommendationCard from './CarRecommendationCard';

// Add CSS animations for the loading dots and spinner
const loadingDotsStyle = `
  @keyframes pulse {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = loadingDotsStyle;
  document.head.appendChild(style);
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBot({ isOpen, onClose }: ChatBotProps) {
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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '500px',
          height: '80%',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              AI Assistant
              {isLoading && (
                <span
                  style={{
                    color: '#3b82f6',
                    fontSize: '0.75rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  (streaming...)
                </span>
              )}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              Ask me anything about cars or anything else!
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem',
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.map(({ id, role, content, parts }) => (
            <div
              key={id}
              style={{
                display: 'flex',
                justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '0.75rem 1rem',
                  borderRadius: '18px',
                  backgroundColor: role === 'user' ? '#3b82f6' : '#f3f4f6',
                  color: role === 'user' ? 'white' : '#1f2937',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      // Style the markdown components
                      p: ({ children }) => (
                        <p style={{ margin: '0 0 0.5rem 0' }}>{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ fontWeight: '600' }}>
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em style={{ fontStyle: 'italic' }}>{children}</em>
                      ),
                      ul: ({ children }) => (
                        <ul
                          style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: '0.25rem' }}>{children}</li>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            backgroundColor:
                              role === 'assistant'
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(0,0,0,0.1)',
                            padding: '0.125rem 0.25rem',
                            borderRadius: '4px',
                            fontSize: '0.8125rem',
                            fontFamily: 'monospace',
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
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '18px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      animation: 'pulse 1.5s ease-in-out infinite 0.2s',
                    }}
                  />
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      animation: 'pulse 1.5s ease-in-out infinite 0.4s',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '0.75rem 1rem',
                  borderRadius: '18px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  border: '1px solid #fecaca',
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
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: isLoading ? '#f9fafb' : 'white',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor:
                    !input.trim() || isLoading ? '#d1d5db' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor:
                    !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
