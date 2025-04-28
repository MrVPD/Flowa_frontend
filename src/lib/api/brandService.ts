import axiosInstance from './axiosConfig';

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
