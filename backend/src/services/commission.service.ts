import { prisma } from '../config/database';
import { ServiceCategory, Commission, Treatment, Service, Visit, Patient } from '@prisma/client';
import { getCurrentMonth, getCurrentYear } from '../utils/date.util';
import { Decimal } from '@prisma/client/runtime/library';

interface CommissionWithTreatment extends Commission {
  treatment: Treatment & {
    service: Service;
    visit: Visit & {
      patient: {
        fullName: string;
      };
    };
  };
}

export class CommissionService {
  async getSummary(userId: string, month?: number, year?: number) {
    const periodMonth = month || getCurrentMonth();
    const periodYear = year || getCurrentYear();

    const commissions = await prisma.commission.findMany({
      where: {
        userId,
        periodMonth,
        periodYear
      },
      include: {
        treatment: {
          include: {
            service: true
          }
        }
      }
    });

    const total = commissions.reduce(
      (sum: number, comm) => sum + comm.commissionAmount.toNumber(),
      0
    );

    const byCategory = commissions.reduce((acc: Record<string, number>, comm) => {
      const category = comm.treatment.service.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += comm.commissionAmount.toNumber();
      return acc;
    }, {});

    return {
      total,
      byCategory,
      commissions
    };
  }

  async getByCategory(
    userId: string,
    category: ServiceCategory,
    month?: number,
    year?: number
  ) {
    const periodMonth = month || getCurrentMonth();
    const periodYear = year || getCurrentYear();

    const commissions = await prisma.commission.findMany({
      where: {
        userId,
        periodMonth,
        periodYear,
        treatment: {
          service: {
            category
          }
        }
      },
      include: {
        treatment: {
          include: {
            service: true,
            visit: {
              include: {
                patient: {
                  select: {
                    fullName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = commissions.reduce(
      (sum: number, comm) => sum + comm.commissionAmount.toNumber(),
      0
    );

    return {
      category,
      total,
      commissions
    };
  }
}