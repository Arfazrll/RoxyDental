import { z } from 'zod';

export const createScheduleSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
  scheduleType: z.enum(['SHIFT', 'MEETING', 'ACTIVITY'], {
    errorMap: () => ({ message: 'Tipe schedule harus SHIFT, MEETING, atau ACTIVITY' })
  }),
  startDatetime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal mulai tidak valid'
  }),
  endDatetime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal selesai tidak valid'
  }),
  location: z.string().optional(),
  isRecurring: z.boolean().optional().default(false),
  recurrencePattern: z.string().optional()
}).refine((data) => {
  const start = new Date(data.startDatetime);
  const end = new Date(data.endDatetime);
  return end > start;
}, {
  message: 'Tanggal selesai harus setelah tanggal mulai',
  path: ['endDatetime']
});

export const updateScheduleSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').optional(),
  description: z.string().optional(),
  startDatetime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal mulai tidak valid'
  }).optional(),
  endDatetime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal selesai tidak valid'
  }).optional(),
  location: z.string().optional()
});