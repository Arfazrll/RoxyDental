import { z } from 'zod';

export const createLeaveSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal mulai tidak valid'
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal selesai tidak valid'
  }),
  leaveType: z.enum(['SICK', 'ANNUAL', 'EMERGENCY', 'UNPAID'], {
    errorMap: () => ({ message: 'Tipe cuti tidak valid' })
  }),
  reason: z.string().min(10, 'Alasan cuti minimal 10 karakter')
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'Tanggal selesai harus sama atau setelah tanggal mulai',
  path: ['endDate']
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status harus APPROVED atau REJECTED' })
  }),
  rejectionReason: z.string().optional()
}).refine((data) => {
  if (data.status === 'REJECTED' && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: 'Alasan penolakan harus diisi jika status REJECTED',
  path: ['rejectionReason']
});