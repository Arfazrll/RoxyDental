import { prisma } from '../config/database';
import { UserRole } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt.util';
import { AppError } from '../middlewares/error.middleware';

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRole;
  specialization?: string;
}

interface UpdateUserData {
  fullName?: string;
  phone?: string;
  specialization?: string;
  isActive?: boolean;
}

export class UserService {
  async getAllUsers(role?: UserRole) {
    const where = role ? { role } : {};

    const users = await prisma.user.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        specialization: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            visitsAsNurse: true,
            treatmentsPerformed: true,
            schedules: true,
            leaveRequests: true,
            commissions: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    return user;
  }

  async createUser(data: CreateUserData) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }]
      }
    });

    if (existingUser) {
      throw new AppError('Username atau email sudah terdaftar', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
        specialization: data.specialization,
        isActive: true
      },
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

    return user;
  }

  async updateUser(id: string, data: UpdateUserData) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        specialization: data.specialization,
        isActive: data.isActive
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        specialization: true,
        isActive: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    await prisma.user.delete({
      where: { id }
    });
  }

  async updateProfile(userId: string, data: any) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError('Email sudah digunakan', 400);
    }
  }

  const updateData: any = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    specialization: data.specialization,
    education: data.education,
    experience: data.experience,
    sipNumber: data.sipNumber,
    profilePhoto: data.profilePhoto
  };

  if (data.sipStartDate) {
    updateData.sipStartDate = new Date(data.sipStartDate);
  }

  if (data.sipEndDate) {
    updateData.sipEndDate = new Date(data.sipEndDate);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      phone: true,
      specialization: true,
      education: true,
      experience: true,
      sipNumber: true,
      sipStartDate: true,
      sipEndDate: true,
      profilePhoto: true,
      isActive: true,
      updatedAt: true
    }
  });

  return updatedUser;
}

async getProfile(userId: string) {
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
      education: true,
      experience: true,
      sipNumber: true,
      sipStartDate: true,
      sipEndDate: true,
      profilePhoto: true,
      isActive: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new AppError('User tidak ditemukan', 404);
  }

  return user;
}

  async toggleUserStatus(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        isActive: true
      }
    });

    return updatedUser;
  }
}