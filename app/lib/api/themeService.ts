import axios from 'axios';
import { getToken } from '../utils/auth';

// Tạo instance axios với base URL từ biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo axios instance với interceptor để tự động thêm token
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Thêm interceptor để gắn token vào header của mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Định nghĩa các interface cho dữ liệu
interface Theme {
  _id: string;
  name: string;
  description: string;
  keywords: string[];
  category: string;
  tone: string;
  brandId?: string;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ThemeCreateData {
  name: string;
  description: string;
  keywords?: string[];
  category: string;
  tone: string;
  brandId?: string;
  isPublic?: boolean;
  isDefault?: boolean;
}

interface ThemeUpdateData {
  name?: string;
  description?: string;
  keywords?: string[];
  category?: string;
  tone?: string;
  brandId?: string;
  isPublic?: boolean;
  isDefault?: boolean;
}

// Service cho quản lý chủ đề
export const themeService = {
  // Lấy danh sách tất cả chủ đề
  getAllThemes: async (filters?: { brandId?: string; category?: string; isPublic?: boolean }) => {
    const response = await axiosInstance.get('/api/themes', { params: filters });
    return response.data;
  },

  // Lấy chi tiết một chủ đề theo ID
  getThemeById: async (id: string) => {
    const response = await axiosInstance.get(`/api/themes/${id}`);
    return response.data;
  },

  // Tạo chủ đề mới
  createTheme: async (data: ThemeCreateData) => {
    const response = await axiosInstance.post('/api/themes', data);
    return response.data;
  },

  // Cập nhật chủ đề
  updateTheme: async (id: string, data: ThemeUpdateData) => {
    const response = await axiosInstance.put(`/api/themes/${id}`, data);
    return response.data;
  },

  // Xóa chủ đề
  deleteTheme: async (id: string) => {
    const response = await axiosInstance.delete(`/api/themes/${id}`);
    return response.data;
  },

  // Lấy chủ đề mặc định
  getDefaultThemes: async () => {
    const response = await axiosInstance.get('/api/themes/default');
    return response.data;
  },

  // Lấy chủ đề công khai
  getPublicThemes: async () => {
    const response = await axiosInstance.get('/api/themes/public');
    return response.data;
  },

  // Lấy chủ đề theo thương hiệu
  getThemesByBrand: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/brands/${brandId}/themes`);
    return response.data;
  },

  // Đặt chủ đề làm mặc định
  setThemeAsDefault: async (id: string) => {
    const response = await axiosInstance.post(`/api/themes/${id}/default`);
    return response.data;
  },

  // Đặt chủ đề làm công khai/riêng tư
  setThemeVisibility: async (id: string, isPublic: boolean) => {
    const response = await axiosInstance.patch(`/api/themes/${id}/visibility`, { isPublic });
    return response.data;
  },

  // Sao chép chủ đề
  cloneTheme: async (id: string, newName: string) => {
    const response = await axiosInstance.post(`/api/themes/${id}/clone`, { name: newName });
    return response.data;
  },

  // Lấy danh sách danh mục chủ đề
  getThemeCategories: async () => {
    const response = await axiosInstance.get('/api/themes/categories');
    return response.data;
  },

  // Lấy danh sách tone chủ đề
  getThemeTones: async () => {
    const response = await axiosInstance.get('/api/themes/tones');
    return response.data;
  },

  // Tìm kiếm chủ đề
  searchThemes: async (query: string) => {
    const response = await axiosInstance.get('/api/themes/search', {
      params: { query },
    });
    return response.data;
  },

  // Gợi ý chủ đề dựa trên nội dung
  suggestThemes: async (content: string) => {
    const response = await axiosInstance.post('/api/themes/suggest', { content });
    return response.data;
  }
};
