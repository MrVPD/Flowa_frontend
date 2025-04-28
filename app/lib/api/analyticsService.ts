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

export const analyticsService = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/api/analytics/dashboard');
    return response.data;
  },

  getContentPerformance: async (period = '30d') => {
    const response = await axiosInstance.get(`/api/analytics/content?period=${period}`);
    return response.data;
  },

  getSocialPerformance: async (period = '30d') => {
    const response = await axiosInstance.get(`/api/analytics/social?period=${period}`);
    return response.data;
  },

  getBrandPerformance: async (brandId: string, period = '30d') => {
    const response = await axiosInstance.get(`/api/analytics/brands/${brandId}?period=${period}`);
    return response.data;
  },

  getEngagementMetrics: async (period = '30d') => {
    const response = await axiosInstance.get(`/api/analytics/engagement?period=${period}`);
    return response.data;
  },

  getAudienceInsights: async () => {
    const response = await axiosInstance.get('/api/analytics/audience');
    return response.data;
  },

  getContentTypePerformance: async () => {
    const response = await axiosInstance.get('/api/analytics/content-types');
    return response.data;
  },

  getPlatformComparison: async () => {
    const response = await axiosInstance.get('/api/analytics/platforms');
    return response.data;
  },

  getPerformanceByTime: async (metric = 'engagement', period = '30d') => {
    const response = await axiosInstance.get(`/api/analytics/time-series?metric=${metric}&period=${period}`);
    return response.data;
  },

  exportAnalyticsReport: async (params: any) => {
    const response = await axiosInstance.post('/api/analytics/export', params, {
      responseType: 'blob',
    });
    return response.data;
  },
};
