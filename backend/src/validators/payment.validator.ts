import { z } from 'zod';

export const createPaymentSchema = z.object({
  visitId: z.string().uuid('Visit ID harus valid UUID'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'CARD', 'QRIS'], {
    errorMap: () => ({ message: 'Metode pembayaran tidak valid' })
  }),
  amount: z.number().positive('Jumlah pembayaran harus lebih dari 0'),
  paidAmount: z.number().positive('Jumlah yang dibayar harus lebih dari 0'),
  referenceNumber: z.string().optional(),
  notes: z.string().optional()
}).refine((data) => data.paidAmount >= data.amount, {
  message: 'Jumlah yang dibayar tidak boleh kurang dari total tagihan',
  path: ['paidAmount']
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED'], {
    errorMap: () => ({ message: 'Status pembayaran tidak valid' })
  })
});