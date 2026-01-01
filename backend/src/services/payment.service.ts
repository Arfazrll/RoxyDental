import { prisma } from '../config/database';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

interface CreatePaymentData {
  visitId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAmount: number;
  referenceNumber?: string;
  notes?: string;
}

export class PaymentService {
  async createPayment(data: CreatePaymentData) {
    const visit = await prisma.visit.findUnique({
      where: { id: data.visitId }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    // Generate payment number
    const lastPayment = await prisma.payment.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    const paymentNumber = lastPayment
      ? `PAY${parseInt(lastPayment.paymentNumber.substring(3)) + 1}`
      : 'PAY1000';

    const changeAmount = data.paidAmount - data.amount;
    const status = data.paidAmount >= data.amount ? PaymentStatus.PAID : PaymentStatus.PARTIAL;

    const payment = await prisma.payment.create({
      data: {
        visitId: data.visitId,
        paymentNumber,
        paymentDate: new Date(),
        paymentMethod: data.paymentMethod,
        amount: data.amount,
        paidAmount: data.paidAmount,
        changeAmount: changeAmount > 0 ? changeAmount : 0,
        status,
        referenceNumber: data.referenceNumber,
        notes: data.notes
      },
      include: {
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
    });

    return payment;
  }

  async getPaymentsByVisit(visitId: string) {
    const payments = await prisma.payment.findMany({
      where: { visitId },
      orderBy: { paymentDate: 'desc' }
    });

    return payments;
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

    return payment;
  }
}