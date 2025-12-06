import { api } from './apiClient';

/**
 * Dashboard API methods
 */
export const dashboardAPI = {
  // Get dashboard summary data
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  // Get detailed analytics
  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },

  // Get progress stats
  getProgress: async () => {
    const response = await api.get('/dashboard/progress');
    return response.data;
  },
};

export default dashboardAPI;
