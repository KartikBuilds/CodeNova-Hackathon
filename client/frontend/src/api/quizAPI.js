import { api } from './apiClient';

/**
 * Quiz API methods
 */
export const quizAPI = {
  // Generate quiz questions
  generateQuiz: async ({ topic, difficulty = 'medium', weaknesses = [], count = 5 }) => {
    const response = await api.post('/quiz/generate', {
      topic,
      difficulty,
      weaknesses,
      count,
    });
    return response.data.data || response.data;
  },

  // Submit quiz answers for grading
  submitQuiz: async ({ moduleId, topic, answers, original_questions }) => {
    const response = await api.post('/quiz/submit', {
      moduleId,
      topic,
      answers,
      original_questions,
    });
    return response.data.data || response.data;
  },

  // Get quiz history
  getQuizHistory: async () => {
    const response = await api.get('/quiz/history');
    return response.data.data || response.data;
  },

  // Get specific quiz session by ID
  getQuizSession: async (sessionId) => {
    const response = await api.get(`/quiz/session/${sessionId}`);
    return response.data.data || response.data;
  },

  // Get quiz stats
  getQuizStats: async () => {
    const response = await api.get('/quiz/stats');
    return response.data.data || response.data;
  },
};

/**
 * Analysis API methods
 */
export const analysisAPI = {
  // Analyze performance
  analyzePerformance: async (performanceData) => {
    const response = await api.post('/analysis/performance', performanceData);
    return response.data.data || response.data;
  },

  // Get performance trends
  getPerformanceTrends: async (params) => {
    const response = await api.get('/analysis/trends', { params });
    return response.data.data || response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/analysis/analytics');
    return response.data;
  },

  // Get strengths and weaknesses
  getStrengthsWeaknesses: async () => {
    const response = await api.get('/analysis/strengths-weaknesses');
    return response.data;
  },
};

export default quizAPI;