import { prisma } from '../config/database';
import { UserRole } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';
import { LoginDto, RegisterDto, AuthResponse, ChangePasswordDto } from '../types/auth.types';
import { emailService } from '../utils/email.util';

export class AuthService {
  async login(data: LoginDto): Promise<AuthResponse> {
    const { username, password, role } = data;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      throw new AppError('Username atau password salah', 401);
    }

    if (user.role !== role) {
      throw new AppError('Role tidak sesuai dengan akun yang terdaftar', 403);
    }

    if (!user.isActive) {
      throw new AppError('Akun tidak aktif. Hubungi administrator', 403);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Username atau password salah', 401);
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        specialization: user.specialization || undefined,
        isActive: user.isActive
      },
      token
    };
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const { username, email, password, fullName, phone, specialization } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new AppError('Username sudah digunakan', 400);
      }
      throw new AppError('Email sudah terdaftar', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role: UserRole.PERAWAT,
        fullName,
        phone,
        specialization: specialization || null,
        isActive: true
      }
    });

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        specialization: user.specialization || undefined,
        isActive: user.isActive
      },
      token
    };
  }

  async registerDoctor(data: RegisterDto): Promise<AuthResponse> {
    const { username, email, password, fullName, phone, specialization } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new AppError('Username sudah digunakan', 400);
      }
      throw new AppError('Email sudah terdaftar', 400);
    }

    if (!specialization) {
      throw new AppError('Spesialisasi wajib diisi untuk dokter', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role: UserRole.DOKTER,
        fullName,
        phone,
        specialization,
        isActive: true
      }
    });

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        specialization: user.specialization || undefined,
        isActive: user.isActive
      },
      token
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Email tidak ditemukan', 404);
    }

    const token = await emailService.generateResetToken(user.id);
    await emailService.sendResetEmail(email, token, user.fullName);
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    if (!await emailService.verifyResetToken(email, token)) {
      throw new AppError('Token tidak valid atau sudah kadaluarsa', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword }
    });

    await emailService.clearResetToken(email);
    await emailService.sendPasswordChangedEmail(email, user.fullName);
  }

  async changePassword(userId: string, data: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Password saat ini salah', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        specialization: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    return user;
  }
}