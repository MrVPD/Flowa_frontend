import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cấu hình axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Đảm bảo xử lý lỗi và log
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface VerificationData {
  email: string;
  code: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface GoogleLoginData {
  tokenId: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
}

interface ApiKeyData {
  service: string;
  key: string;
  isActive: boolean;
}

// Response interfaces
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

interface BeginRegistrationResponse {
  message: string;
}

interface GoogleLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

export const authService = {
  // Begin registration process by sending verification code
  beginRegistration: async (data: RegisterData) => {
    try {
      const response = await axiosInstance.post<BeginRegistrationResponse>('/api/users/register-begin', data);
      return response.data;
    } catch (error) {
      console.error('Registration start error details:', error);
      throw error;
    }
  },

  // Complete registration with verification code
  completeRegistration: async (data: VerificationData) => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/api/users/register-complete', data);
      return response.data;
    } catch (error) {
      console.error('Registration completion error details:', error);
      throw error;
    }
  },

  // Legacy registration (if needed)
  register: async (data: RegisterData) => {
    // Log để debug
    console.log('Sending registration data to:', `${API_URL}/api/users/register`);
    try {
      const response = await axiosInstance.post('/api/users/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error);
      throw error;
    }
  },

  login: async (data: LoginData) => {
    console.log('Sending login data to:', `${API_URL}/api/users/login`);
    try {
      const response = await axiosInstance.post('/api/users/login', data);
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },

  // Đăng nhập với Google
  loginWithGoogle: async (tokenId: string) => {
    try {
      const response = await axiosInstance.post<GoogleLoginResponse>('/api/auth/google', { tokenId });
      return response.data;
    } catch (error) {
      console.error('Google login error details:', error);
      throw error;
    }
  },

  getProfile: async () => {
    // Add token to request
    const token = localStorage.getItem('flowa_token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

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

  // Verify email from token link
  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get(`/api/users/verify-email/${token}`);
    return response.data;
  },
};
