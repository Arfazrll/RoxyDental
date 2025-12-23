import { z } from 'zod';

export const createPaymentSchema = z.object({
  visitId: z.string().uuid('Visit ID harus valid UUID'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'CARD', 'QRIS'], {
    errorMap: () => ({ message: 'Metode pembayaran tidak valid' })
  }),
  amount: z.number().positive('Jumlah pembayaran harus lebih dari 0'),
  paidAmount: z.number().min(0, 'Jumlah yang dibayar tidak boleh negatif'),
  referenceNumber: z.string().optional(),
  notes: z.string().optional()
});

export const updatePaymentSchema = z.object({
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'CARD', 'QRIS'], {
    errorMap: () => ({ message: 'Metode pembayaran tidak valid' })
  }).optional(),
  amount: z.number().positive('Jumlah pembayaran harus lebih dari 0').optional(),
  paidAmount: z.number().min(0, 'Jumlah yang dibayar tidak boleh negatif').optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional()
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED'], {
    errorMap: () => ({ message: 'Status pembayaran tidak valid' })
  })
});