import { useState, useRef, useEffect } from 'react';
import './DocumentRAG.css';
import apiClient from '../api/apiClient';

const DocumentRAG = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState('');
  const [, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract text from PDF using simple approach
  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target.result;


          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            content: (text || '').substring(0, 8000), // Limit to first 8000 chars to avoid token limits
            uploadedAt: new Date().toLocaleString(),
            id: Date.now(),
          });
        } catch (err) {
          console.error(`[extractTextFromFile] Error in onload:`, err);
          reject(err);
        }
      };

      reader.onerror = (error) => {
        console.error(`[extractTextFromFile] FileReader error:`, error);
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      // Read as text (works for .txt, .md, and sometimes PDF)
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (e) => {

    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));

        // Validate file type
        if (!['text/plain', 'text/markdown'].includes(file.type) && !file.name.endsWith('.md')) {
          const errorMsg = `File ${file.name} is not supported. Please upload .txt or .md files. PDF uploads are not supported yet.`;
          setError(errorMsg);
          continue;
        }

        const doc = await extractTextFromFile(file);

        setDocuments((prev) => [...prev, doc]);
        setSelectedDoc(doc);
        setMessages([]);
        setAnswer('');
      }
    } catch (err) {
      console.error('Error in handleFileUpload:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const callDocumentAnalysisAPI = async (docContent, userQuestion) => {
    try {
      const { data } = await apiClient.post('/analysis/document', {
        documentContent: docContent,
        question: userQuestion
      });

      if (data.success && data.data) {
        return {
          answer: data.data.answer,
          source: data.data.source,
          note: data.data.note
        };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      console.error('Document Analysis API Error:', err);
      throw new Error(err.response?.data?.error?.message || err.message || 'Failed to analyze the document. Please try again.');
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!selectedDoc) {
      setError('Please select or upload a document first');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add user question to messages
      const userMessage = {
        role: 'user',
        content: question,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Get AI response
      const result = await callDocumentAnalysisAPI(selectedDoc.content, question);

      // Warn user if mock data is being used
      if (result.source === 'mock-fallback') {
        setError('⚠️ Using demo data (Groq API key not configured). Results are not real AI analysis.');
      }

      const assistantMessage = {
        role: 'assistant',
        content: result.answer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAnswer(result.answer);
      setQuestion('');
    } catch (err) {
      setError(err.message);
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedDoc) {
      setError('Please select a document first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const summaryPrompt = `Please provide a comprehensive summary of this document. Include:
1. Main topic/purpose
2. Key points (bullet format)
3. Important details
4. Conclusion or takeaway

Format the response clearly with sections.`;

      const result = await callDocumentAnalysisAPI(selectedDoc.content, summaryPrompt);

      // Warn user if mock data is being used
      if (result.source === 'mock-fallback') {
        setError('⚠️ Using demo data (Groq API key not configured). Results are not real AI analysis.');
      }

      const userMessage = {
        role: 'user',
        content: 'Please summarize this document',
        timestamp: new Date().toLocaleTimeString(),
      };

      const assistantMessage = {
        role: 'assistant',
        content: result.answer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([userMessage, assistantMessage]);
      setQuestion('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setDocuments([]);
    setSelectedDoc(null);
    setMessages([]);
    setQuestion('');
    setAnswer('');
    setError('');
  };

  const handleRemoveDoc = (id) => {
    const filtered = documents.filter((doc) => doc.id !== id);
    setDocuments(filtered);
    if (selectedDoc?.id === id) {
      setSelectedDoc(filtered[0] || null);
      setMessages([]);
      setAnswer('');
    }
  };

  return (
    <div className="rag-container">
      <div className="rag-header">
        <h1>📄 Document Q&A with AI</h1>
        <p>Upload documents and ask questions about their content</p>
      </div>

      <div className="rag-layout">
        {/* Sidebar - Documents */}
        <div className="rag-sidebar">
          <div className="sidebar-header">
            <h3>📚 Uploaded Documents</h3>
            {documents.length > 0 && (
              <button onClick={handleClearAll} className="clear-all-btn">
                Clear All
              </button>
            )}
          </div>

          <div className="upload-area">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md"
              className="file-input"
              disabled={loading}
              id="doc-file-input"
            />
            <label htmlFor="doc-file-input" className="upload-label">
              <div className="upload-icon">📤</div>
              <span>Upload Documents</span>
              <small>Supported: .txt, .md (PDF not yet supported)</small>
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>

          <div className="documents-list">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`doc-item ${selectedDoc?.id === doc.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDoc(doc);
                  setMessages([]);
                  setAnswer('');
                }}
              >
                <div className="doc-info">
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-meta">
                    {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveDoc(doc.id);
                  }}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Chat */}
        <div className="rag-main">
          {selectedDoc ? (
            <>
              <div className="document-info">
                <h3>📋 {selectedDoc.name}</h3>
                <div className="doc-preview">
                  <p>{selectedDoc.content.substring(0, 200)}...</p>
                </div>
              </div>

              {/* Messages */}
              <div className="rag-messages">
                {messages.length === 0 && (
                  <div className="empty-state">
                    <p>👋 Start by asking a question or summarizing the document</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`rag-message rag-message-${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                ))}
                {loading && (
                  <div className="rag-message rag-message-assistant">
                    <div className="message-content">
                      <span className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button onClick={handleSummarize} disabled={loading} className="action-btn">
                  📝 Summarize
                </button>
                <button
                  onClick={() => setQuestion('What are the main points?')}
                  disabled={loading}
                  className="action-btn"
                >
                  🎯 Main Points
                </button>
                <button
                  onClick={() => setQuestion('What are the key takeaways?')}
                  disabled={loading}
                  className="action-btn"
                >
                  💡 Key Takeaways
                </button>
              </div>

              {/* Error Message */}
              {error && <div className="error-message">{error}</div>}

              {/* Input Area */}
              <form onSubmit={handleAskQuestion} className="rag-input-form">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about this document..."
                  disabled={loading}
                  className="rag-input"
                />
                <button type="submit" disabled={loading || !question.trim()} className="rag-send-btn">
                  {loading ? '...' : '📤'}
                </button>
              </form>
            </>
          ) : (
            <div className="no-doc-state">
              <div className="state-icon">📄</div>
              <h2>No Document Selected</h2>
              <p>Upload a document from the left sidebar to get started</p>
              <p className="hint">Supported formats: .txt, .md</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentRAG;
