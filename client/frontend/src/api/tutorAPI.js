import { api } from './apiClient';

/**
 * Tutor/Chat API methods
 */
export const tutorAPI = {
  // Send a chat message to the AI tutor
  chat: async ({ message, context = null }) => {
    const response = await api.post('/tutor/chat', {
      message,
      context,
    });
    return response.data;
  },

  // Get chat history
  getChatHistory: async () => {
    const response = await api.get('/tutor/history');
    return response.data;
  },

  // Clear chat history
  clearHistory: async () => {
    const response = await api.delete('/tutor/history');
    return response.data;
  },

  // Get tutor suggestions
  getSuggestions: async (topic) => {
    const response = await api.get('/tutor/suggestions', {
      params: { topic },
    });
    return response.data;
  },
};

export default tutorAPI;
