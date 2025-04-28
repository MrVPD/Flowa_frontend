import axiosInstance from './axiosConfig';

interface ProductData {
  name: string;
  description: string;
  brandId: string;
  features?: string[];
  benefits?: string[];
  targetAudience?: string;
  isActive?: boolean;
}

export const productService = {
  createProduct: async (productData: ProductData) => {
    const response = await axiosInstance.post('/api/products', productData);
    return response.data;
  },

  getProducts: async () => {
    const response = await axiosInstance.get('/api/products');
    return response.data;
  },

  getProductsByBrand: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/products/brand/${brandId}`);
    return response.data;
  },

  getProductById: async (productId: string) => {
    const response = await axiosInstance.get(`/api/products/${productId}`);
    return response.data;
  },

  updateProduct: async (productId: string, productData: Partial<ProductData>) => {
    const response = await axiosInstance.put(`/api/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId: string) => {
    const response = await axiosInstance.delete(`/api/products/${productId}`);
    return response.data;
  },

  uploadImages: async (productId: string, imageFiles: File[]) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await axiosInstance.post(`/api/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
