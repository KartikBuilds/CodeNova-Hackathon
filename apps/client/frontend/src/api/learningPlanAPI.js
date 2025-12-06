import { api } from './apiClient';

/**
 * Learning Plan API methods
 */
export const learningPlanAPI = {
  // Create a personalized learning plan
  createPlan: async (planData) => {
    const response = await api.post('/learning/plan', planData);
    return response.data.data || response.data;
  },

  // Get saved learning plans
  getSavedPlans: async (params) => {
    const response = await api.get('/learning/plans', { params });
    return response.data.data || response.data;
  },

  // Update plan progress
  updateProgress: async (planId, progressData) => {
    const response = await api.patch(`/learning/plan/${planId}/progress`, progressData);
    return response.data.data || response.data;
  },
};

/**
 * Learning Path API methods
 */
export const learningPathAPI = {
  // Get learning path for a domain
  getLearningPath: async (domain) => {
    const response = await api.get('/learning/path', {
      params: { domain },
    });
    return response.data.data || response.data;
  },

  // Rebuild/create learning path
  rebuildPath: async (domain) => {
    const response = await api.post('/learning/path/rebuild', { domain });
    return response.data.data || response.data;
  },

  // Update module status
  updateModuleStatus: async (moduleId, statusData) => {
    const response = await api.patch(`/learning/path/module/${moduleId}`, statusData);
    return response.data.data || response.data;
  },

  // Get progress summary
  getProgress: async (domain) => {
    const response = await api.get('/learning/path/progress', {
      params: { domain },
    });
    return response.data.data || response.data;
  },
};

export default { learningPlanAPI, learningPathAPI };
