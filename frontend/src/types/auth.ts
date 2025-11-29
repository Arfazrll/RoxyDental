export type UserRole = 'DOKTER' | 'PERAWAT';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  specialization?: string;
  isActive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  specialization?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any;
}