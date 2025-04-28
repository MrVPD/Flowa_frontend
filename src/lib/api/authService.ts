import axiosInstance from './axiosConfig';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

interface ApiKeyData {
  service: string;
  key: string;
  isActive: boolean;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post('/api/users/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axiosInstance.post('/api/users/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await axiosInstance.put('/api/users/profile', data);
    return response.data;
  },

  manageApiKeys: async (apiKeys: ApiKeyData[]) => {
    const response = await axiosInstance.put('/api/users/api-keys', { apiKeys });
    return response.data;
  },
};
