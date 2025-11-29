import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string({
    required_error: "Username harus diisi",
    invalid_type_error: "Username harus berupa string"
  }).min(3, 'Username minimal 3 karakter'),
  
  password: z.string({
    required_error: "Password harus diisi",
    invalid_type_error: "Password harus berupa string"
  }).min(6, 'Password minimal 6 karakter'),
  
  role: z.enum(['DOKTER', 'PERAWAT'], {
    required_error: "Role harus diisi",
    invalid_type_error: "Role harus DOKTER atau PERAWAT"
  })
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  specialization: z.string().optional()
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  token: z.string().min(1, 'Token harus diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter')
});