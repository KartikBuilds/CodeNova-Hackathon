import { api } from './apiClient';

/**
 * Performance Analysis API methods
 */
export const analysisAPI = {
  // Analyze performance from quiz results
  analyzePerformance: async (quizData) => {
    const response = await api.post('/analysis/analyze', quizData);
    return response.data.data || response.data;
  },

  // Get strengths and weaknesses
  getStrengthsWeaknesses: async () => {
    const response = await api.get('/analysis/strengths-weaknesses');
    return response.data.data || response.data;
  },

  // Get performance history
  getPerformanceHistory: async () => {
    const response = await api.get('/analysis/history');
    return response.data.data || response.data;
  },

  // Get topic mastery
  getTopicMastery: async (topic) => {
    const response = await api.get('/analysis/topic-mastery', {
      params: { topic },
    });
    return response.data.data || response.data;
  },
};

export default analysisAPI;
