import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { ServiceCategory } from '../../generated/prisma';

interface CreateServiceData {
  serviceName: string;
  category: ServiceCategory;
  basePrice: number;
  commissionRate: number;
  description?: string;
}

interface UpdateServiceData {
  serviceName?: string;
  category?: ServiceCategory;
  basePrice?: number;
  commissionRate?: number;
  description?: string;
}

export class ServiceService {
  private async generateServiceCode(): Promise<string> {
    const count = await prisma.service.count();
    const code = `SRV-${String(count + 1).padStart(4, '0')}`;

    const existing = await prisma.service.findFirst({
      where: { serviceCode: code } // snake_case
    });

    if (existing) {
      return `SRV-${String(count + 2).padStart(4, '0')}`;
    }

    return code;
  }

  async getServices(
    page: number = 1,
    limit: number = 50,
    category?: string,
    search?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (category && Object.values(ServiceCategory).includes(category as ServiceCategory)) {
      where.category = category as ServiceCategory;
    }

    if (search) {
      where.OR = [
        { serviceName: { contains: search, mode: 'insensitive' } }, // camelCase
        { serviceCode: { contains: search, mode: 'insensitive' } } // snake_case
      ];
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { serviceName: 'asc' }, // camelCase
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ]);

    return {
      services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getServiceById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new AppError('Layanan tidak ditemukan', 404);
    }

    return service;
  }

  async createService(data: CreateServiceData) {
    const serviceCode = await this.generateServiceCode();

    const service = await prisma.service.create({
      data: {
        serviceCode: serviceCode,      // snake_case
        serviceName: data.serviceName,   // camelCase
        category: data.category,
        basePrice: data.basePrice,       // camelCase
        commissionRate: data.commissionRate, // camelCase
        description: data.description
      }
    });

    return service;
  }

  async updateService(id: string, data: UpdateServiceData) {
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      throw new AppError('Layanan tidak ditemukan', 404);
    }

    const updateData: any = {};

    if (data.serviceName !== undefined) updateData.serviceName = data.serviceName;       // camelCase
    if (data.category !== undefined) updateData.category = data.category;
    if (data.basePrice !== undefined) updateData.basePrice = data.basePrice;            // camelCase
    if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate; // camelCase
    if (data.description !== undefined) updateData.description = data.description;

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    return service;
  }

  async deleteService(id: string) {
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { treatments: true }
        }
      }
    });

    if (!existingService) {
      throw new AppError('Layanan tidak ditemukan', 404);
    }

    if (existingService._count.treatments > 0) {
      throw new AppError('Layanan tidak dapat dihapus karena sudah digunakan dalam treatment', 400);
    }

    await prisma.service.delete({
      where: { id }
    });
  }
}