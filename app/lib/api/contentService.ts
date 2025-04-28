import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('flowa_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface ContentGenerationParams {
  brandId: string;
  themeId: string;
  platform: string;
  contentType: string;
  tone: string;
  keywords?: string;
}

interface ContentOptimizationParams {
  contentId: string;
  platform: string;
  optimizationType?: string;
}

export const contentService = {
  getThemes: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/content/themes?brandId=${brandId}`);
    return response.data;
  },

  getAllThemes: async () => {
    const response = await axiosInstance.get('/api/content/themes');
    return response.data;
  },

  createTheme: async (themeData: any) => {
    const response = await axiosInstance.post('/api/content/themes', themeData);
    return response.data;
  },

  generateContent: async (params: ContentGenerationParams) => {
    const response = await axiosInstance.post('/api/content/generate', params);
    return response.data;
  },

  optimizeContent: async (params: ContentOptimizationParams) => {
    const response = await axiosInstance.post('/api/content/optimize', params);
    return response.data;
  },

  getUserContent: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/api/content?page=${page}&limit=${limit}`);
    return response.data;
  },

  getContentById: async (contentId: string) => {
    const response = await axiosInstance.get(`/api/content/${contentId}`);
    return response.data;
  },

  deleteContent: async (contentId: string) => {
    const response = await axiosInstance.delete(`/api/content/${contentId}`);
    return response.data;
  },

  saveContent: async (contentData: any) => {
    const response = await axiosInstance.post('/api/content/save', contentData);
    return response.data;
  },
};
