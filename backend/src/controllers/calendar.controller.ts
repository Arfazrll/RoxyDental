import { Response } from 'express';
import { PrismaClient, Prisma } from '../../generated/prisma';

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

export const createLeaveRequest = async (req: any, res: Response): Promise<void> => {
  try {
    console.log('Create leave request - User:', req.user);
    console.log('Create leave request - Body:', req.body);

    const userId = req.user.id;
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

    console.log('Creating leave with data:', {
      userId,
      startDate: start,
      endDate: end,
      reason,
      leaveType: leaveType || 'ANNUAL'
    });

    const leave = await prisma.leaveRequest.create({
      data: {
        userId,
        startDate: start,
        endDate: end,
        reason,
        leaveType: leaveType || 'ANNUAL',
        status: 'PENDING'
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
      }
    });

    console.log('Leave created successfully:', leave);

    res.status(201).json({
      success: true,
      data: leave,
      message: 'Pengajuan cuti berhasil dibuat'
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
    if (leaveType) updateData.leaveType = leaveType;

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
        type: 'LEAVE',
        status: leave.status,
        userId: leave.userId,
        userName: leave.requester.fullName,
        color: 'bg-pink-200'
      })),
      ...visits.map((visit: any) => ({
        id: visit.id,
        title: `Kunjungan - ${visit.patient.fullName}`,
        description: visit.chiefComplaint || 'Kunjungan Pasien',
        startDate: visit.visitDate.toISOString().split('T')[0],
        endDate: visit.visitDate.toISOString().split('T')[0],
        type: 'VISIT',
        status: visit.status,
        patientName: visit.patient.fullName,
        nurseName: visit.nurse.fullName,
        color: 'bg-blue-200'
      }))
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
          { endDate: { gte: new Date(startDate as string) } }
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
        nurseId: userId,
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
        type: 'LEAVE',
        status: leave.status,
        userId: leave.userId,
        userName: leave.requester.fullName,
        color: 'bg-pink-200'
      })),
      ...visits.map((visit: any) => ({
        id: visit.id,
        title: `Kunjungan - ${visit.patient.fullName}`,
        description: visit.chiefComplaint || 'Kunjungan Pasien',
        startDate: visit.visitDate.toISOString().split('T')[0],
        endDate: visit.visitDate.toISOString().split('T')[0],
        type: 'VISIT',
        status: visit.status,
        patientName: visit.patient.fullName,
        nurseName: visit.nurse.fullName,
        color: 'bg-blue-200'
      }))
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