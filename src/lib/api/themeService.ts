import axiosInstance from './axiosConfig';

interface ThemeData {
  name: string;
  description: string;
  brandId: string;
  category?: string;
  contentLength?: string;
  tone?: string;
  style?: string;
  isActive?: boolean;
}

export const themeService = {
  createTheme: async (themeData: ThemeData) => {
    const response = await axiosInstance.post('/api/themes', themeData);
    return response.data;
  },

  getThemes: async () => {
    const response = await axiosInstance.get('/api/themes');
    return response.data;
  },

  getThemesByBrand: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/themes/brand/${brandId}`);
    return response.data;
  },

  getThemeById: async (themeId: string) => {
    const response = await axiosInstance.get(`/api/themes/${themeId}`);
    return response.data;
  },

  updateTheme: async (themeId: string, themeData: Partial<ThemeData>) => {
    const response = await axiosInstance.put(`/api/themes/${themeId}`, themeData);
    return response.data;
  },

  deleteTheme: async (themeId: string) => {
    const response = await axiosInstance.delete(`/api/themes/${themeId}`);
    return response.data;
  },
};
