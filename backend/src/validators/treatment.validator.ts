import { z } from 'zod';

export const updateTreatmentSchema = z.object({
  toothNumber: z.string().optional(),
  diagnosis: z.string().min(10, 'Diagnosis minimal 10 karakter').optional(),
  treatmentNotes: z.string().min(10, 'Catatan treatment minimal 10 karakter').optional(),
  quantity: z.number().int().positive('Quantity harus bilangan positif').optional(),
  discount: z.number().min(0, 'Discount tidak boleh negatif').optional(),
  images: z.array(z.string()).optional()
});

export const createTreatmentSchema = z.object({
  visitId: z.string().uuid('Visit ID harus valid UUID'),
  serviceId: z.string().uuid('Service ID harus valid UUID'),
  toothNumber: z.string().optional(),
  diagnosis: z.string().min(10, 'Diagnosis minimal 10 karakter').optional(),
  treatmentNotes: z.string().optional(),
  quantity: z.number().int().positive('Quantity harus bilangan positif').default(1),
  discount: z.number().min(0, 'Discount tidak boleh negatif').default(0),
  images: z.array(z.string()).optional().default([])
});