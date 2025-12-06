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
    return response.data;
  },

  // Submit quiz answers for grading
  submitQuiz: async ({ answers, original_questions }) => {
    const response = await api.post('/quiz/submit', {
      answers,
      original_questions,
    });
    return response.data;
  },

  // Get quiz history
  getQuizHistory: async () => {
    const response = await api.get('/quiz/history');
    return response.data;
  },

  // Get specific quiz by ID
  getQuizById: async (quizId) => {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  },
};

/**
 * Analysis API methods
 */
export const analysisAPI = {
  // Analyze performance
  analyzePerformance: async (performanceData) => {
    const response = await api.post('/analysis/performance', performanceData);
    return response.data;
  },

  // Get user analytics
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
