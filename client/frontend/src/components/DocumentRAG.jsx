import { useState, useRef, useEffect } from 'react';
import './DocumentRAG.css';

const DocumentRAG = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
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
      console.log(`[extractTextFromFile] Starting for ${file.name}`);
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          console.log(`[extractTextFromFile] onload triggered for ${file.name}`);
          let text = '';
          
          // Handle PDF files differently
          if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            // For PDF files, extract readable text from the binary content
            const arrayBuffer = e.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Convert to string and extract text between stream markers
            let pdfString = '';
            for (let i = 0; i < uint8Array.length; i++) {
              const char = uint8Array[i];
              // Only include printable ASCII characters
              if (char >= 32 && char <= 126) {
                pdfString += String.fromCharCode(char);
              } else if (char === 10 || char === 13) {
                pdfString += ' ';
              }
            }
            
            // Try to extract text content from PDF
            // Look for text between BT (begin text) and ET (end text) markers
            const textMatches = pdfString.match(/\(([^)]+)\)/g) || [];
            const extractedTexts = textMatches
              .map(match => match.slice(1, -1)) // Remove parentheses
              .filter(t => t.length > 2 && !/^[%\d\s.]+$/.test(t)) // Filter out numbers/metadata
              .filter(t => !/^[A-Z]{1,3}\d+/.test(t)) // Filter PDF operators
              .join(' ');
            
            if (extractedTexts.length > 100) {
              text = extractedTexts;
            } else {
              // Fallback: Extract any readable sentences
              const sentences = pdfString.match(/[A-Z][a-z]+(?:\s+[a-z]+)+[.!?]/g) || [];
              const words = pdfString.match(/\b[A-Za-z]{3,}\b/g) || [];
              text = sentences.length > 5 ? sentences.join(' ') : words.slice(0, 500).join(' ');
            }
            
            // Clean up the extracted text
            text = text
              .replace(/\s+/g, ' ')
              .replace(/[^\x20-\x7E\n]/g, '')
              .trim();
            
            // If still no meaningful text, provide a helpful message
            if (text.length < 50) {
              text = `**PDF Document: ${file.name}**\n\nThis PDF appears to contain primarily images or scanned content that cannot be extracted as text. The document has ${Math.round(file.size / 1024)} KB of data.\n\nFor better results, please:\n1. Use a PDF with selectable text\n2. Convert the PDF to a text file first\n3. Use OCR software to extract text from scanned documents`;
            }
            
            console.log(`[extractTextFromFile] PDF text extracted: ${text.length} characters`);
          } else {
            // For text files, read directly
            text = e.target.result;
          }
          
          console.log(`[extractTextFromFile] Text extracted: ${text?.length || 0} characters`);
          
          if (!text || text.length === 0) {
            console.warn(`[extractTextFromFile] No text extracted from ${file.name}`);
          }
          
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
      
      // Read PDF as ArrayBuffer, text files as text
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        console.log(`[extractTextFromFile] Reading PDF as ArrayBuffer: ${file.name}`);
        reader.readAsArrayBuffer(file);
      } else {
        console.log(`[extractTextFromFile] Reading as text: ${file.name}`);
        reader.readAsText(file);
      }
    });
  };

  const handleFileUpload = async (e) => {
    console.log('=== handleFileUpload triggered ===');
    console.log('Event target:', e.target);
    console.log('Event target files:', e.target.files);
    
    const files = Array.from(e.target.files || []);
    console.log(`Files selected: ${files.length}`);
    
    if (!files.length) {
      console.log('No files selected, returning');
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}/${files.length}: ${file.name} (${file.type}, ${file.size} bytes)`);
        
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));

        // Validate file type
        if (!['text/plain', 'text/markdown', 'application/pdf'].includes(file.type) && !file.name.endsWith('.md')) {
          const errorMsg = `File ${file.name} is not supported. Please upload .txt, .md, or .pdf files.`;
          console.warn(errorMsg);
          setError(errorMsg);
          continue;
        }

        console.log(`Extracting text from ${file.name}...`);
        const doc = await extractTextFromFile(file);
        console.log(`Successfully extracted text: ${doc.content.length} characters`);
        
        setDocuments((prev) => [...prev, doc]);
        setSelectedDoc(doc);
        setMessages([]);
        setAnswer('');
        console.log(`Document added to state`);
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

  const callGroqRAG = async (docContent, userQuestion) => {
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
              content: `You are a helpful document analysis assistant. Your task is to:
1. Answer questions about the provided document
2. Extract key information when asked to summarize
3. Be accurate and cite specific parts of the document when possible
4. If information is not in the document, clearly state that
5. Provide clear, well-structured responses

Document content:
---
${docContent}
---`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userQuestion
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error('Groq API Error:', err);
      throw new Error(err.message || 'Failed to connect to AI. Please check your API key.');
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
      const aiResponse = await callGroqRAG(selectedDoc.content, question);

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAnswer(aiResponse);
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

      const response = await callGroqRAG(selectedDoc.content, summaryPrompt);

      const userMessage = {
        role: 'user',
        content: 'Please summarize this document',
        timestamp: new Date().toLocaleTimeString(),
      };

      const assistantMessage = {
        role: 'assistant',
        content: response,
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
              accept=".txt,.md,.pdf"
              className="file-input"
              disabled={loading}
              id="doc-file-input"
            />
            <label htmlFor="doc-file-input" className="upload-label">
              <div className="upload-icon">📤</div>
              <span>Upload Documents</span>
              <small>Supported: .txt, .md, .pdf</small>
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
                  <p>{selectedDoc.content.substring(0, 200).replace(/[^\x20-\x7E\n]/g, '').trim()}...</p>
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
              <p className="hint">Supported formats: .txt, .md, .pdf</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentRAG;
