import { api } from './apiClient';

/**
 * Profile API methods
 */
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Create/update profile with specific fields
  setProfilePreferences: async ({ primaryDomain, level, goals }) => {
    const response = await api.put('/profile', {
      primaryDomain,
      level,
      goals,
    });
    return response.data;
  },
};

/**
 * Learning Path API methods
 */
export const learningPathAPI = {
  // Rebuild learning path
  rebuildPath: async () => {
    const response = await api.post('/learning/path/rebuild');
    return response.data;
  },

  // Get current learning path
  getPath: async () => {
    const response = await api.get('/learning/path');
    return response.data;
  },

  // Update path progress
  updateProgress: async (progressData) => {
    const response = await api.put('/learning/path/progress', progressData);
    return response.data;
  },
};

/**
 * Learning Plan API methods
 */
export const learningPlanAPI = {
  // Generate learning plan
  generatePlan: async ({ topic, strengths = [], weaknesses = [], duration = 7 }) => {
    const response = await api.post('/learning/plan', {
      topic,
      strengths,
      weaknesses,
      duration,
    });
    return response.data;
  },

  // Get current learning plan
  getCurrentPlan: async () => {
    const response = await api.get('/learning/plan');
    return response.data;
  },

  // Update plan progress
  updatePlanProgress: async (progressData) => {
    const response = await api.put('/learning/plan/progress', progressData);
    return response.data;
  },
};

/**
 * Combined operation: Update profile and rebuild learning path
 */
export const updateProfileAndRebuildPath = async (profileData) => {
  try {
    // Update profile
    const profileResponse = await profileAPI.updateProfile(profileData);
    
    // Rebuild learning path
    const pathResponse = await learningPathAPI.rebuildPath();
    
    return {
      profile: profileResponse,
      path: pathResponse,
    };
  } catch (error) {
    throw error;
  }
};
