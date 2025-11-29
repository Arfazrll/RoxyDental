export interface LoginDto {
  username: string;
  password: string;
  role: 'DOKTER' | 'PERAWAT';
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  specialization?: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  specialization?: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}