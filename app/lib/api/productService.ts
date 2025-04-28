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
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  brandId: string;
  status: 'active' | 'inactive' | 'draft';
  inventory: {
    quantity: number;
    sku: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
  category: string;
  tags?: string[];
  brandId: string;
  status?: 'active' | 'inactive' | 'draft';
  inventory?: {
    quantity: number;
    sku: string;
  };
}

interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  brandId?: string;
  status?: 'active' | 'inactive' | 'draft';
  inventory?: {
    quantity?: number;
    sku?: string;
  };
}

// Service cho quản lý sản phẩm
export const productService = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (filters?: { brandId?: string; category?: string; status?: string }) => {
    const response = await axiosInstance.get('/api/products', { params: filters });
    return response.data;
  },

  // Lấy chi tiết một sản phẩm theo ID
  getProductById: async (id: string) => {
    const response = await axiosInstance.get(`/api/products/${id}`);
    return response.data;
  },

  // Tạo sản phẩm mới
  createProduct: async (data: ProductCreateData) => {
    const response = await axiosInstance.post('/api/products', data);
    return response.data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: string, data: ProductUpdateData) => {
    const response = await axiosInstance.put(`/api/products/${id}`, data);
    return response.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/api/products/${id}`);
    return response.data;
  },

  // Upload hình ảnh sản phẩm
  uploadProductImage: async (id: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axiosInstance.post(`/api/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Xóa hình ảnh sản phẩm
  deleteProductImage: async (id: string, imageUrl: string) => {
    const response = await axiosInstance.delete(`/api/products/${id}/images`, {
      data: { imageUrl },
    });
    return response.data;
  },

  // Lấy danh sách danh mục sản phẩm
  getProductCategories: async () => {
    const response = await axiosInstance.get('/api/products/categories');
    return response.data;
  },

  // Lấy sản phẩm theo thương hiệu
  getProductsByBrand: async (brandId: string) => {
    const response = await axiosInstance.get(`/api/brands/${brandId}/products`);
    return response.data;
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query: string) => {
    const response = await axiosInstance.get('/api/products/search', {
      params: { query },
    });
    return response.data;
  },

  // Cập nhật trạng thái sản phẩm
  updateProductStatus: async (id: string, status: 'active' | 'inactive' | 'draft') => {
    const response = await axiosInstance.patch(`/api/products/${id}/status`, { status });
    return response.data;
  },

  // Cập nhật tồn kho sản phẩm
  updateProductInventory: async (id: string, quantity: number) => {
    const response = await axiosInstance.patch(`/api/products/${id}/inventory`, { quantity });
    return response.data;
  }
};
