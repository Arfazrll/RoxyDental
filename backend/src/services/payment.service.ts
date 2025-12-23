import { prisma } from '../config/database';
import { PaymentMethod, PaymentStatus } from '../../generated/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CreatePaymentData {
  visitId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAmount: number;
  referenceNumber?: string;
  notes?: string;
}

interface UpdatePaymentData {
  paymentMethod?: PaymentMethod;
  amount?: number;
  paidAmount?: number;
  referenceNumber?: string;
  notes?: string;
}

interface PaymentWithRelations {
  id: string;
  visitId: string;
  paymentNumber: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAmount: number;
  changeAmount: number;
  status: PaymentStatus;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  visit: {
    id: string;
    visitNumber: string;
    visitDate: string;
    patient: {
      id: string;
      patientNumber: string;
      medicalRecordNumber: string | null;
      fullName: string;
    };
  };
}

export class PaymentService {
  private async generatePaymentNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const lastPayment = await prisma.payment.findFirst({
      where: {
        paymentNumber: {
          startsWith: `PAY-${year}${month}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastPayment) {
      const lastSequence = parseInt(lastPayment.paymentNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `PAY-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  async createPayment(data: CreatePaymentData): Promise<PaymentWithRelations> {
    const visit = await prisma.visit.findUnique({
      where: { id: data.visitId },
      include: {
        patient: {
          select: {
            id: true,
            patientNumber: true,
            medicalRecordNumber: true,
            fullName: true
          }
        }
      }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    const paymentNumber = await this.generatePaymentNumber();
    const changeAmount = Math.max(data.paidAmount - data.amount, 0);
    
    let status: PaymentStatus;
    if (data.paidAmount === 0) {
      status = PaymentStatus.PENDING;
    } else if (data.paidAmount >= data.amount) {
      status = PaymentStatus.PAID;
    } else {
      status = PaymentStatus.PARTIAL;
    }

    const payment = await prisma.payment.create({
      data: {
        visitId: data.visitId,
        paymentNumber,
        paymentDate: new Date(),
        paymentMethod: data.paymentMethod,
        amount: data.amount,
        paidAmount: data.paidAmount,
        changeAmount,
        status,
        referenceNumber: data.referenceNumber,
        notes: data.notes
      },
      include: {
        visit: {
          include: {
            patient: {
              select: {
                id: true,
                patientNumber: true,
                medicalRecordNumber: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    return {
      id: payment.id,
      visitId: payment.visitId,
      paymentNumber: payment.paymentNumber,
      paymentDate: payment.paymentDate.toISOString(),
      paymentMethod: payment.paymentMethod,
      amount: payment.amount.toNumber(),
      paidAmount: payment.paidAmount.toNumber(),
      changeAmount: payment.changeAmount.toNumber(),
      status: payment.status,
      referenceNumber: payment.referenceNumber || undefined,
      notes: payment.notes || undefined,
      createdAt: payment.createdAt.toISOString(),
      visit: {
        id: payment.visit.id,
        visitNumber: payment.visit.visitNumber,
        visitDate: payment.visit.visitDate.toISOString(),
        patient: {
          id: payment.visit.patient.id,
          patientNumber: payment.visit.patient.patientNumber,
          medicalRecordNumber: payment.visit.patient.medicalRecordNumber,
          fullName: payment.visit.patient.fullName
        }
      }
    };
  }

  async updatePayment(id: string, data: UpdatePaymentData): Promise<PaymentWithRelations> {
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
      include: {
        visit: {
          include: {
            patient: true
          }
        }
      }
    });

    if (!existingPayment) {
      throw new AppError('Pembayaran tidak ditemukan', 404);
    }

    const amount = data.amount !== undefined ? data.amount : existingPayment.amount.toNumber();
    const paidAmount = data.paidAmount !== undefined ? data.paidAmount : existingPayment.paidAmount.toNumber();
    const changeAmount = Math.max(paidAmount - amount, 0);
    
    let status: PaymentStatus;
    if (paidAmount === 0) {
      status = PaymentStatus.PENDING;
    } else if (paidAmount >= amount) {
      status = PaymentStatus.PAID;
    } else {
      status = PaymentStatus.PARTIAL;
    }

    const updateData: any = {
      paymentDate: new Date(),
      changeAmount,
      status
    };

    if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.paidAmount !== undefined) updateData.paidAmount = data.paidAmount;
    if (data.referenceNumber !== undefined) updateData.referenceNumber = data.referenceNumber;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        visit: {
          include: {
            patient: {
              select: {
                id: true,
                patientNumber: true,
                medicalRecordNumber: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    return {
      id: payment.id,
      visitId: payment.visitId,
      paymentNumber: payment.paymentNumber,
      paymentDate: payment.paymentDate.toISOString(),
      paymentMethod: payment.paymentMethod,
      amount: payment.amount.toNumber(),
      paidAmount: payment.paidAmount.toNumber(),
      changeAmount: payment.changeAmount.toNumber(),
      status: payment.status,
      referenceNumber: payment.referenceNumber || undefined,
      notes: payment.notes || undefined,
      createdAt: payment.createdAt.toISOString(),
      visit: {
        id: payment.visit.id,
        visitNumber: payment.visit.visitNumber,
        visitDate: payment.visit.visitDate.toISOString(),
        patient: {
          id: payment.visit.patient.id,
          patientNumber: payment.visit.patient.patientNumber,
          medicalRecordNumber: payment.visit.patient.medicalRecordNumber,
          fullName: payment.visit.patient.fullName
        }
      }
    };
  }

  async getPaymentsByVisit(visitId: string) {
    const payments = await prisma.payment.findMany({
      where: { visitId },
      orderBy: { paymentDate: 'desc' }
    });

    return payments.map(p => ({
      ...p,
      amount: p.amount.toNumber(),
      paidAmount: p.paidAmount.toNumber(),
      changeAmount: p.changeAmount.toNumber()
    }));
  }

  async getAllPayments(search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { paymentNumber: { contains: search, mode: 'insensitive' } },
        { visit: { visitNumber: { contains: search, mode: 'insensitive' } } },
        { visit: { patient: { fullName: { contains: search, mode: 'insensitive' } } } }
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        visit: {
          include: {
            patient: {
              select: {
                id: true,
                patientNumber: true,
                medicalRecordNumber: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return payments.map(p => ({
      id: p.id,
      visitId: p.visitId,
      paymentNumber: p.paymentNumber,
      paymentDate: p.paymentDate.toISOString(),
      paymentMethod: p.paymentMethod,
      amount: p.amount.toNumber(),
      paidAmount: p.paidAmount.toNumber(),
      changeAmount: p.changeAmount.toNumber(),
      status: p.status,
      referenceNumber: p.referenceNumber,
      notes: p.notes,
      createdAt: p.createdAt.toISOString(),
      visit: {
        id: p.visit.id,
        visitNumber: p.visit.visitNumber,
        visitDate: p.visit.visitDate.toISOString(),
        patient: {
          id: p.visit.patient.id,
          patientNumber: p.visit.patient.patientNumber,
          medicalRecordNumber: p.visit.patient.medicalRecordNumber,
          fullName: p.visit.patient.fullName
        }
      }
    }));
  }

  async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        visit: {
          include: {
            patient: true
          }
        }
      }
    });

    if (!payment) {
      throw new AppError('Pembayaran tidak ditemukan', 404);
    }

    return {
      ...payment,
      amount: payment.amount.toNumber(),
      paidAmount: payment.paidAmount.toNumber(),
      changeAmount: payment.changeAmount.toNumber()
    };
  }
}