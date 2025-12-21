import apiClient from './api.client';

export interface LoginData {
  username: string;
  password: string;
  role: 'DOKTER' | 'PERAWAT';
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  specialization?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      role: string;
      phone: string;
      specialization?: string;
      isActive: boolean;
    };
    token: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      document.cookie = `token=${response.data.data.token}; path=/; max-age=604800`;
    }
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      document.cookie = `token=${response.data.data.token}; path=/; max-age=604800`;
    }
    
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
      const response = await apiClient.put('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Terjadi kesalahan pada server'
      };
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};