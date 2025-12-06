import { api } from './apiClient';

/**
 * Dashboard API methods
 */
export const dashboardAPI = {
  // Get dashboard summary data
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data.data || response.data;
  },

  // Get activity timeline
  getActivity: async (params) => {
    const response = await api.get('/dashboard/activity', { params });
    return response.data.data || response.data;
  },

  // Get topic breakdown
  getTopics: async () => {
    const response = await api.get('/dashboard/topics');
    return response.data.data || response.data;
  },

  // Get recommendations
  getRecommendations: async () => {
    const response = await api.get('/dashboard/recommendations');
    return response.data.data || response.data;
  },
};

export default dashboardAPI;
