import { useState, useRef, useEffect } from 'react';
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

  const callGroqAPI = async (userMessage, currentMessages) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content: `You are a helpful, patient, and encouraging AI tutor. Your role is to:
- Explain concepts clearly and simply
- Answer questions about various subjects (programming, data science, web development, etc.)
- Provide examples and analogies to help understanding
- Give study tips and learning strategies
- Be encouraging and supportive
- Keep responses concise but informative (2-3 paragraphs max)
- Use markdown formatting for code snippets when relevant`
            },
            ...currentMessages
              .filter(msg => msg.role === 'user' || msg.role === 'assistant')
              .map(msg => ({
                role: msg.role,
                content: msg.content
              })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error('Groq API Error:', err);
      throw new Error(err.message || 'Failed to connect to AI. Please check your API key configuration.');
    }
  };

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
      // Call Groq API directly with current messages
      const aiResponse = await callGroqAPI(input.trim(), [...messages, userMessage]);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your AI tutor. Ask me anything about your learning topics, and I\'ll do my best to help you understand! 📚',
        timestamp: new Date(),
      },
    ]);
    setError('');
  };

  return (
    <div className="tutor-chat-container">
      <div className="tutor-chat-header">
        <h2>🤖 AI Tutor</h2>
        <button onClick={clearChat} className="clear-btn" title="Clear chat">
          🔄
        </button>
      </div>

      <div className="tutor-chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`tutor-message tutor-message-${message.role}`}
          >
            <div className="tutor-message-content">
              {message.content}
            </div>
            <span className="tutor-message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
        {loading && (
          <div className="tutor-message tutor-message-assistant">
            <div className="tutor-message-content tutor-loading">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="tutor-message tutor-message-error">
            <div className="tutor-message-content">
              ❌ {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="tutor-chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about learning..."
          disabled={loading}
          className="tutor-input"
        />
        <button type="submit" disabled={loading || !input.trim()} className="tutor-send-btn">
          {loading ? '...' : '📤'}
        </button>
      </form>
    </div>
  );
};

export default TutorChat;