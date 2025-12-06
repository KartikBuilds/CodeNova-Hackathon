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

  // Get courses by domain with pagination
  getCourses: async (domain, params = {}) => {
    const queryParams = { domain, ...params };
    const response = await api.get('/catalog/courses', {
      params: queryParams,
    });
    // Return full response to preserve pagination metadata
    return response.data;
  },

  // Get all courses (no domain filter) with pagination
  getAllCourses: async (params = {}) => {
    const response = await api.get('/catalog/courses', {
      params,
    });
    // Return full response to preserve pagination metadata
    return response.data;
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
