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

interface BrandData {
  name: string;
  description: string;
  tone?: string;
  keywords?: string[];
  hashtags?: string[];
  postingSchedule?: any;
  contentRules?: string;
}

export const brandService = {
  createBrand: async (brandData: BrandData) => {
    const response = await axiosInstance.post('/api/brands', brandData);
    return response.data;
  },

  getBrands: async () => {
    const response = await axiosInstance.get('/api/brands');
    return response.data;
  },

  getBrandById: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/brands/${brandId}`);
    return response.data;
  },

  updateBrand: async (brandId: string, brandData: Partial<BrandData>) => {
    const response = await axiosInstance.put(`/api/brands/${brandId}`, brandData);
    return response.data;
  },

  deleteBrand: async (brandId: string) => {
    const response = await axiosInstance.delete(`/api/brands/${brandId}`);
    return response.data;
  },

  uploadLogo: async (brandId: string, logoFile: File) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await axiosInstance.post(`/api/brands/${brandId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadImages: async (brandId: string, imageFiles: File[]) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await axiosInstance.post(`/api/brands/${brandId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
