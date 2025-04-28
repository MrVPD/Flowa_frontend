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
interface GeneralSettings {
  siteName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  contentAlerts: boolean;
  socialAlerts: boolean;
  analyticsReports: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  cookieConsent: boolean;
  analyticsTracking: boolean;
  marketingEmails: boolean;
}

interface ApiSettings {
  rateLimit: number;
  webhookUrl: string;
  apiKeys: Array<{
    name: string;
    key: string;
    permissions: string[];
    createdAt: string;
  }>;
}

interface UserSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  api: ApiSettings;
}

// Service cho quản lý cài đặt
export const settingsService = {
  // Lấy tất cả cài đặt của người dùng
  getUserSettings: async () => {
    const response = await axiosInstance.get('/api/settings');
    return response.data;
  },

  // Cập nhật cài đặt chung
  updateGeneralSettings: async (settings: Partial<GeneralSettings>) => {
    const response = await axiosInstance.put('/api/settings/general', settings);
    return response.data;
  },

  // Cập nhật cài đặt thông báo
  updateNotificationSettings: async (settings: Partial<NotificationSettings>) => {
    const response = await axiosInstance.put('/api/settings/notifications', settings);
    return response.data;
  },

  // Cập nhật cài đặt quyền riêng tư
  updatePrivacySettings: async (settings: Partial<PrivacySettings>) => {
    const response = await axiosInstance.put('/api/settings/privacy', settings);
    return response.data;
  },

  // Cập nhật cài đặt API
  updateApiSettings: async (settings: Partial<ApiSettings>) => {
    const response = await axiosInstance.put('/api/settings/api', settings);
    return response.data;
  },

  // Tạo API key mới
  createApiKey: async (name: string, permissions: string[]) => {
    const response = await axiosInstance.post('/api/settings/api/keys', { name, permissions });
    return response.data;
  },

  // Xóa API key
  deleteApiKey: async (keyId: string) => {
    const response = await axiosInstance.delete(`/api/settings/api/keys/${keyId}`);
    return response.data;
  },

  // Cập nhật logo
  updateLogo: async (logoFile: File) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await axiosInstance.post('/api/settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cập nhật favicon
  updateFavicon: async (faviconFile: File) => {
    const formData = new FormData();
    formData.append('favicon', faviconFile);
    
    const response = await axiosInstance.post('/api/settings/favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Lấy danh sách múi giờ
  getTimezones: async () => {
    const response = await axiosInstance.get('/api/settings/timezones');
    return response.data;
  },

  // Lấy danh sách ngôn ngữ được hỗ trợ
  getLanguages: async () => {
    const response = await axiosInstance.get('/api/settings/languages');
    return response.data;
  },

  // Xuất cài đặt
  exportSettings: async () => {
    const response = await axiosInstance.get('/api/settings/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Nhập cài đặt
  importSettings: async (settingsFile: File) => {
    const formData = new FormData();
    formData.append('settings', settingsFile);
    
    const response = await axiosInstance.post('/api/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Khôi phục cài đặt mặc định
  resetSettings: async () => {
    const response = await axiosInstance.post('/api/settings/reset');
    return response.data;
  }
};
