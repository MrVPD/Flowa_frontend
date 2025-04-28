import axiosInstance from './axiosConfig';

interface ChatData {
  brandId: string;
  title: string;
  aiModel?: string;
  modelParameters?: any;
}

interface MessageData {
  content: string;
  role?: 'user' | 'assistant';
}

export const chatService = {
  createChat: async (chatData: ChatData) => {
    const response = await axiosInstance.post('/api/chat', chatData);
    return response.data;
  },

  getChats: async () => {
    const response = await axiosInstance.get('/api/chat');
    return response.data;
  },

  getChatsByBrand: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/chat/brand/${brandId}`);
    return response.data;
  },

  getChatById: async (chatId: string) => {
    const response = await axiosInstance.get(`/api/chat/${chatId}`);
    return response.data;
  },

  sendMessage: async (chatId: string, messageData: MessageData) => {
    const response = await axiosInstance.post(`/api/chat/${chatId}/message`, messageData);
    return response.data;
  },

  generateContent: async (chatId: string, themeId: string) => {
    const response = await axiosInstance.post(`/api/chat/${chatId}/generate`, { themeId });
    return response.data;
  },

  parseCommand: async (chatId: string, command: string) => {
    const response = await axiosInstance.post(`/api/chat/${chatId}/parse-command`, { command });
    return response.data;
  },
};
