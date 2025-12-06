import { useState, useRef, useEffect } from 'react';
import { tutorAPI } from '../api/tutorAPI';
import './TutorChat.css';

const TutorChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI tutor. Ask me anything about your learning topics, and I\'ll do my best to help you understand! 📚',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Call tutor API
      const response = await tutorAPI.chat({ message: input.trim() });
      
      // Add AI response to chat
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response || response.message || 'I apologize, but I couldn\'t generate a response.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get response. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="tutor-chat-container">
      <div className="chat-header">
        <div className="header-info">
          <h2>🤖 AI Tutor</h2>
          <p>Ask questions and get instant help</p>
        </div>
        <button onClick={clearChat} className="clear-button">
          Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.role}`}
          >
            <div className={`message-bubble ${message.role} ${message.isError ? 'error' : ''}`}>
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message-wrapper assistant">
            <div className="message-bubble assistant typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="chat-input"
            rows="1"
            disabled={loading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : '📤'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>

      <div className="chat-suggestions">
        <p>Try asking:</p>
        <div className="suggestions-list">
          <button
            onClick={() => setInput('Explain the difference between let and const in JavaScript')}
            className="suggestion-chip"
          >
            Explain let vs const
          </button>
          <button
            onClick={() => setInput('What are React hooks?')}
            className="suggestion-chip"
          >
            What are React hooks?
          </button>
          <button
            onClick={() => setInput('How does async/await work?')}
            className="suggestion-chip"
          >
            Async/await explained
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;
