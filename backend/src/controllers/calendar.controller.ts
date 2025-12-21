import { Response } from 'express';
import { PrismaClient, Prisma, UserRole } from '../../generated/prisma';

const prisma = new PrismaClient();

interface AuthRequest {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
  body: any;
  params: any;
  query: any;
}

type LeaveWithRequester = Prisma.LeaveRequestGetPayload<{
  include: {
    requester: {
      select: {
        id: true;
        fullName: true;
        role: true;
      };
    };
  };
}>;

type VisitWithRelations = Prisma.VisitGetPayload<{
  include: {
    patient: {
      select: {
        id: true;
        fullName: true;
      };
    };
    nurse: {
      select: {
        id: true;
        fullName: true;
      };
    };
  };
}>;

export const getMyLeaveRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const leaves = await prisma.leaveRequest.findMany({
      where: { userId },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error: any) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil data cuti'
    });
  }
};

export const getAllLeaveRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error: any) {
    console.error('Error fetching all leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil data cuti'
    });
  }
};

export const getPendingLeaveRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      where: { 
        status: 'PENDING',
        requester: {
          role: 'PERAWAT'
        }
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error: any) {
    console.error('Error fetching pending leave requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil data pengajuan cuti'
    });
  }
};

export const createLeaveRequest = async (req: any, res: Response): Promise<void> => {
  try {
    console.log('Create leave request - User:', req.user);
    console.log('Create leave request - Body:', req.body);

    const userId = req.user.id;
    const userRole = req.user.role;
    const { startDate, endDate, reason, leaveType } = req.body;

    if (!startDate || !endDate || !reason) {
      res.status(400).json({
        success: false,
        message: 'Data tidak lengkap. Mohon isi semua field.'
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid'
      });
      return;
    }

    if (end < start) {
      res.status(400).json({
        success: false,
        message: 'Tanggal akhir tidak boleh lebih kecil dari tanggal awal'
      });
      return;
    }

    const validLeaveType = leaveType && ['SICK', 'ANNUAL', 'EMERGENCY', 'UNPAID'].includes(leaveType) 
      ? leaveType 
      : 'ANNUAL';

    const status = userRole === 'DOKTER' ? 'APPROVED' : 'PENDING';

    console.log('Creating leave with data:', {
      userId,
      startDate: start,
      endDate: end,
      reason,
      leaveType: validLeaveType,
      status
    });

    const leave = await prisma.leaveRequest.create({
      data: {
        userId,
        startDate: start,
        endDate: end,
        reason,
        leaveType: validLeaveType,
        status,
        approvedBy: userRole === 'DOKTER' ? userId : null,
        approvedAt: userRole === 'DOKTER' ? new Date() : null
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    console.log('Leave created successfully:', leave);

    res.status(201).json({
      success: true,
      data: leave,
      message: userRole === 'DOKTER' 
        ? 'Pengajuan cuti berhasil dibuat' 
        : 'Pengajuan cuti berhasil dibuat dan menunggu persetujuan dokter'
    });
  } catch (error: any) {
    console.error('Error creating leave request:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal membuat pengajuan cuti'
    });
  }
};

export const approveLeaveRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    if (req.user.role !== 'DOKTER') {
      res.status(403).json({
        success: false,
        message: 'Hanya dokter yang dapat menyetujui pengajuan cuti'
      });
      return;
    }

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            fullName: true,
            role: true
          }
        }
      }
    });

    if (!existingLeave) {
      res.status(404).json({
        success: false,
        message: 'Pengajuan cuti tidak ditemukan'
      });
      return;
    }

    if (existingLeave.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        message: 'Pengajuan cuti sudah diproses sebelumnya'
      });
      return;
    }

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: doctorId,
        approvedAt: new Date()
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: leave,
      message: `Pengajuan cuti ${existingLeave.requester.fullName} berhasil disetujui`
    });
  } catch (error: any) {
    console.error('Error approving leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal menyetujui pengajuan cuti'
    });
  }
};

export const rejectLeaveRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    const { rejectionReason } = req.body;

    if (req.user.role !== 'DOKTER') {
      res.status(403).json({
        success: false,
        message: 'Hanya dokter yang dapat menolak pengajuan cuti'
      });
      return;
    }

    if (!rejectionReason) {
      res.status(400).json({
        success: false,
        message: 'Alasan penolakan harus diisi'
      });
      return;
    }

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            fullName: true,
            role: true
          }
        }
      }
    });

    if (!existingLeave) {
      res.status(404).json({
        success: false,
        message: 'Pengajuan cuti tidak ditemukan'
      });
      return;
    }

    if (existingLeave.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        message: 'Pengajuan cuti sudah diproses sebelumnya'
      });
      return;
    }

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedBy: doctorId,
        approvedAt: new Date(),
        rejectionReason
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        approver: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: leave,
      message: `Pengajuan cuti ${existingLeave.requester.fullName} berhasil ditolak`
    });
  } catch (error: any) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal menolak pengajuan cuti'
    });
  }
};

export const updateLeaveRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { startDate, endDate, reason, leaveType } = req.body;

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id }
    });

    if (!existingLeave) {
      res.status(404).json({
        success: false,
        message: 'Pengajuan cuti tidak ditemukan'
      });
      return;
    }

    if (existingLeave.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah pengajuan ini'
      });
      return;
    }

    if (existingLeave.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        message: 'Pengajuan yang sudah disetujui/ditolak tidak dapat diubah'
      });
      return;
    }

    const updateData: any = {};

    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (reason) updateData.reason = reason;
    if (leaveType && ['SICK', 'ANNUAL', 'EMERGENCY', 'UNPAID'].includes(leaveType)) {
      updateData.leaveType = leaveType;
    }

    const leave = await prisma.leaveRequest.update({
      where: { id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: leave,
      message: 'Pengajuan cuti berhasil diubah'
    });
  } catch (error: any) {
    console.error('Error updating leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengubah pengajuan cuti'
    });
  }
};

export const deleteLeaveRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id }
    });

    if (!existingLeave) {
      res.status(404).json({
        success: false,
        message: 'Pengajuan cuti tidak ditemukan'
      });
      return;
    }

    if (existingLeave.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus pengajuan ini'
      });
      return;
    }

    if (existingLeave.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        message: 'Pengajuan yang sudah disetujui/ditolak tidak dapat dihapus'
      });
      return;
    }

    await prisma.leaveRequest.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Pengajuan cuti berhasil dihapus'
    });
  } catch (error: any) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal menghapus pengajuan cuti'
    });
  }
};

export const getCalendarEvents = async (req: any, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Parameter startDate dan endDate diperlukan'
      });
      return;
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: {
        AND: [
          { startDate: { lte: new Date(endDate as string) } },
          { endDate: { gte: new Date(startDate as string) } },
          { status: 'APPROVED' }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });

    const visits = await prisma.visit.findMany({
      where: {
        visitDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true
          }
        },
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    const events = [
      ...leaves.map((leave: any) => ({
        id: leave.id,
        title: `Cuti - ${leave.requester.fullName}`,
        description: leave.reason,
        startDate: leave.startDate.toISOString().split('T')[0],
        endDate: leave.endDate.toISOString().split('T')[0],
        startTime: '00:00',
        endTime: '23:59',
        type: 'LEAVE',
        status: leave.status,
        userId: leave.userId,
        userName: leave.requester.fullName,
        patientName: null,
        color: 'bg-yellow-100'
      })),
      ...visits.map((visit: any) => {
        const visitDate = new Date(visit.visitDate);
        const dateStr = visitDate.toISOString().split('T')[0];
        const hours = visitDate.getHours();
        const minutes = visitDate.getMinutes();
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const endMinutes = minutes + 30;
        const endHours = hours + Math.floor(endMinutes / 60);
        const finalEndMinutes = endMinutes % 60;
        const endTimeStr = `${endHours.toString().padStart(2, '0')}:${finalEndMinutes.toString().padStart(2, '0')}`;

        return {
          id: visit.id,
          title: `Kunjungan - ${visit.patient.fullName}`,
          description: visit.chiefComplaint || 'Kunjungan Pasien',
          startDate: dateStr,
          endDate: dateStr,
          startTime: timeStr,
          endTime: endTimeStr,
          type: 'VISIT',
          status: visit.status,
          patientName: visit.patient.fullName,
          userName: visit.nurse?.fullName || null,
          color: 'bg-blue-100'
        };
      })
    ];

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil data kalender'
    });
  }
};

export const getMyCalendarEvents = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    console.log('Get my calendar events - User ID:', userId);
    console.log('Get my calendar events - Date range:', { startDate, endDate });

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Parameter startDate dan endDate diperlukan'
      });
      return;
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: {
        userId,
        AND: [
          { startDate: { lte: new Date(endDate as string) } },
          { endDate: { gte: new Date(startDate as string) } },
          { status: 'APPROVED' }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });

    console.log('Leaves found:', leaves.length);

    const visits = await prisma.visit.findMany({
      where: {
        visitDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true
          }
        },
        nurse: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    console.log('Visits found:', visits.length);

    const events = [
      ...leaves.map((leave: any) => ({
        id: leave.id,
        title: `Cuti - ${leave.requester.fullName}`,
        description: leave.reason,
        startDate: leave.startDate.toISOString().split('T')[0],
        endDate: leave.endDate.toISOString().split('T')[0],
        startTime: '00:00',
        endTime: '23:59',
        type: 'LEAVE',
        status: leave.status,
        userId: leave.userId,
        userName: leave.requester.fullName,
        patientName: null,
        color: 'bg-yellow-100'
      })),
      ...visits.map((visit: any) => {
        const visitDate = new Date(visit.visitDate);
        const dateStr = visitDate.toISOString().split('T')[0];
        const hours = visitDate.getHours();
        const minutes = visitDate.getMinutes();
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const endMinutes = minutes + 30;
        const endHours = hours + Math.floor(endMinutes / 60);
        const finalEndMinutes = endMinutes % 60;
        const endTimeStr = `${endHours.toString().padStart(2, '0')}:${finalEndMinutes.toString().padStart(2, '0')}`;

        return {
          id: visit.id,
          title: `Kunjungan - ${visit.patient.fullName}`,
          description: visit.chiefComplaint || 'Kunjungan Pasien',
          startDate: dateStr,
          endDate: dateStr,
          startTime: timeStr,
          endTime: endTimeStr,
          type: 'VISIT',
          status: visit.status,
          patientName: visit.patient.fullName,
          userName: visit.nurse?.fullName || null,
          color: 'bg-blue-100'
        };
      })
    ];

    console.log('Total events:', events.length);

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error: any) {
    console.error('Error fetching my calendar events:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil data kalender'
    });
  }
};