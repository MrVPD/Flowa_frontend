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
interface Integration {
  _id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationCreateData {
  name: string;
  type: string;
  config: Record<string, any>;
}

interface IntegrationUpdateData {
  name?: string;
  status?: 'active' | 'inactive' | 'pending';
  config?: Record<string, any>;
}

// Service cho quản lý tích hợp
export const integrationService = {
  // Lấy danh sách tất cả tích hợp
  getAllIntegrations: async () => {
    const response = await axiosInstance.get('/api/integrations');
    return response.data;
  },

  // Lấy chi tiết một tích hợp theo ID
  getIntegrationById: async (id: string) => {
    const response = await axiosInstance.get(`/api/integrations/${id}`);
    return response.data;
  },

  // Tạo tích hợp mới
  createIntegration: async (data: IntegrationCreateData) => {
    const response = await axiosInstance.post('/api/integrations', data);
    return response.data;
  },

  // Cập nhật tích hợp
  updateIntegration: async (id: string, data: IntegrationUpdateData) => {
    const response = await axiosInstance.put(`/api/integrations/${id}`, data);
    return response.data;
  },

  // Xóa tích hợp
  deleteIntegration: async (id: string) => {
    const response = await axiosInstance.delete(`/api/integrations/${id}`);
    return response.data;
  },

  // Kích hoạt tích hợp
  activateIntegration: async (id: string) => {
    const response = await axiosInstance.post(`/api/integrations/${id}/activate`);
    return response.data;
  },

  // Vô hiệu hóa tích hợp
  deactivateIntegration: async (id: string) => {
    const response = await axiosInstance.post(`/api/integrations/${id}/deactivate`);
    return response.data;
  },

  // Kiểm tra trạng thái kết nối của tích hợp
  checkIntegrationStatus: async (id: string) => {
    const response = await axiosInstance.get(`/api/integrations/${id}/status`);
    return response.data;
  },

  // Đồng bộ dữ liệu từ tích hợp
  syncIntegrationData: async (id: string) => {
    const response = await axiosInstance.post(`/api/integrations/${id}/sync`);
    return response.data;
  },

  // Lấy danh sách các loại tích hợp được hỗ trợ
  getSupportedIntegrationTypes: async () => {
    const response = await axiosInstance.get('/api/integrations/types');
    return response.data;
  }
};
