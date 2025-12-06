import { api } from './apiClient';

/**
 * Catalog API methods
 */
export const catalogAPI = {
  // Get all available domains
  getDomains: async () => {
    const response = await api.get('/catalog/domains');
    return response.data.data || response.data;
  },

  // Get courses by domain
  getCourses: async (domain) => {
    const response = await api.get('/catalog/courses', {
      params: { domain },
    });
    return response.data.data || response.data;
  },

  // Get all courses (no domain filter)
  getAllCourses: async () => {
    const response = await api.get('/catalog/courses');
    return response.data.data || response.data;
  },

  // Get course details by ID
  getCourseById: async (courseId) => {
    const response = await api.get(`/catalog/course/${courseId}`);
    return response.data.data || response.data;
  },

  // Get module details by ID
  getModuleById: async (moduleId) => {
    const response = await api.get(`/catalog/module/${moduleId}`);
    return response.data.data || response.data;
  },
};

export default catalogAPI;
