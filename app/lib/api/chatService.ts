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

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatSession {
  id?: string;
  title?: string;
  brandId?: string;
  messages: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}

export const chatService = {
  // Chat sessions
  getSessions: async () => {
    const response = await axiosInstance.get('/api/chat/sessions');
    return response.data;
  },

  getSessionById: async (sessionId: string) => {
    const response = await axiosInstance.get(`/api/chat/sessions/${sessionId}`);
    return response.data;
  },

  createSession: async (sessionData: Partial<ChatSession>) => {
    const response = await axiosInstance.post('/api/chat/sessions', sessionData);
    return response.data;
  },

  updateSession: async (sessionId: string, sessionData: Partial<ChatSession>) => {
    const response = await axiosInstance.put(`/api/chat/sessions/${sessionId}`, sessionData);
    return response.data;
  },

  deleteSession: async (sessionId: string) => {
    const response = await axiosInstance.delete(`/api/chat/sessions/${sessionId}`);
    return response.data;
  },

  // Chat messages
  sendMessage: async (sessionId: string, message: string) => {
    const response = await axiosInstance.post(`/api/chat/sessions/${sessionId}/messages`, { content: message });
    return response.data;
  },

  // Content generation via chat
  generateContentFromChat: async (sessionId: string, prompt: string, options: any = {}) => {
    const response = await axiosInstance.post(`/api/chat/sessions/${sessionId}/generate`, { prompt, options });
    return response.data;
  },

  // Brand-specific chat
  getBrandChatSessions: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/chat/brands/${brandId}/sessions`);
    return response.data;
  },

  // Chat templates
  getChatTemplates: async () => {
    const response = await axiosInstance.get('/api/chat/templates');
    return response.data;
  },

  // Chat analytics
  getChatAnalytics: async () => {
    const response = await axiosInstance.get('/api/chat/analytics');
    return response.data;
  },
};
