import { z } from 'zod';

export const createVisitSchema = z.object({
  patient: z.object({
    id: z.string().uuid().optional(),
    fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Format tanggal tidak valid'
    }),
    gender: z.enum(['L', 'P'], {
      errorMap: () => ({ message: 'Gender harus L atau P' })
    }),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
    address: z.string().optional(),
    bloodType: z.string().optional(),
    allergies: z.string().optional(),
    medicalHistory: z.string().optional()
  }),
  visit: z.object({
    visitDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return false;
      }
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return parsedDate >= thirtyDaysAgo;
    }, {
      message: 'Tanggal dan jam kunjungan tidak valid atau terlalu lama'
    }),
    chiefComplaint: z.string().optional(),
    bloodPressure: z.string().optional(),
    notes: z.string().optional()
  })
});

export const updateVisitStatusSchema = z.object({
  status: z.enum(['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Status tidak valid' })
  })
});