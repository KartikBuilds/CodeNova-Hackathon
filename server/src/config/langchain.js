import { ChatGroq } from '@langchain/groq';

/**
 * Initialize Groq LLM with LangChain
 * Uses llama-3.1-70b-versatile model for high-quality responses
 */
export const initializeGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.warn('⚠️  GROQ_API_KEY not configured. AI features will use mock data.');
    return null;
  }

  try {
    const llm = new ChatGroq({
      apiKey: apiKey,
      model: 'openai/gpt-oss-120b', // Fast and capable model
      temperature: 0.7, // Balance creativity and accuracy
      maxTokens: 2048, // Sufficient for most responses
    });

    console.log('✅ Groq LLM initialized successfully');
    return llm;
  } catch (error) {
    console.error('❌ Failed to initialize Groq LLM:', error.message);
    return null;
  }
};

/**
 * Get LLM instance - singleton pattern
 */
let llmInstance = null;

export const getGroqLLM = () => {
  if (!llmInstance) {
    llmInstance = initializeGroq();
  }
  return llmInstance;
};

/**
 * Test Groq connection
 */
export const testGroqConnection = async () => {
  const llm = getGroqLLM();
  
  if (!llm) {
    return { success: false, error: 'Groq API key not configured' };
  }

  try {
    const response = await llm.invoke('Say "Hello" if you can hear me.');
    return { 
      success: true, 
      message: 'Groq connection successful',
      response: response.content 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};
