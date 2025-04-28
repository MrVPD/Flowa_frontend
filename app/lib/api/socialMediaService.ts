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

interface SocialAccount {
  platform: string;
  username: string;
  accessToken?: string;
  refreshToken?: string;
  profileId?: string;
}

interface SocialPost {
  accountId: string;
  content: string;
  mediaUrls?: string[];
  scheduledDate?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
  brandId?: string;
}

export const socialMediaService = {
  // Social Accounts
  getAccounts: async () => {
    const response = await axiosInstance.get('/api/social/accounts');
    return response.data;
  },

  addAccount: async (accountData: SocialAccount) => {
    const response = await axiosInstance.post('/api/social/accounts', accountData);
    return response.data;
  },

  connectAccount: async (accountId: string, connectionData: any) => {
    const response = await axiosInstance.post(`/api/social/accounts/${accountId}/connect`, connectionData);
    return response.data;
  },

  disconnectAccount: async (accountId: string) => {
    const response = await axiosInstance.post(`/api/social/accounts/${accountId}/disconnect`);
    return response.data;
  },

  deleteAccount: async (accountId: string) => {
    const response = await axiosInstance.delete(`/api/social/accounts/${accountId}`);
    return response.data;
  },

  // Social Posts
  getPosts: async (filters = {}) => {
    const response = await axiosInstance.get('/api/social/posts', { params: filters });
    return response.data;
  },

  getPostById: async (postId: string) => {
    const response = await axiosInstance.get(`/api/social/posts/${postId}`);
    return response.data;
  },

  createPost: async (postData: SocialPost) => {
    const response = await axiosInstance.post('/api/social/posts', postData);
    return response.data;
  },

  updatePost: async (postId: string, postData: Partial<SocialPost>) => {
    const response = await axiosInstance.put(`/api/social/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await axiosInstance.delete(`/api/social/posts/${postId}`);
    return response.data;
  },

  schedulePost: async (postId: string, scheduledDate: string) => {
    const response = await axiosInstance.post(`/api/social/posts/${postId}/schedule`, { scheduledDate });
    return response.data;
  },

  publishPost: async (postId: string) => {
    const response = await axiosInstance.post(`/api/social/posts/${postId}/publish`);
    return response.data;
  },

  // Media uploads
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('media', file);
    
    const response = await axiosInstance.post('/api/social/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Analytics
  getPostAnalytics: async (postId: string) => {
    const response = await axiosInstance.get(`/api/social/posts/${postId}/analytics`);
    return response.data;
  },

  getAccountAnalytics: async (accountId: string, period = '30d') => {
    const response = await axiosInstance.get(`/api/social/accounts/${accountId}/analytics?period=${period}`);
    return response.data;
  },
};
