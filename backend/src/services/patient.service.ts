import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class PatientService {
  private async generatePatientNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    const lastPatient = await prisma.patient.findFirst({
      where: {
        patientNumber: {
          startsWith: `P-${year}${month}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastPatient) {
      const lastSequence = parseInt(lastPatient.patientNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `P-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  private async generateMedicalRecordNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    const lastPatient = await prisma.patient.findFirst({
      where: {
        medicalRecordNumber: {
          startsWith: `RM-${year}${month}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastPatient && lastPatient.medicalRecordNumber) {
      const lastSequence = parseInt(lastPatient.medicalRecordNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `RM-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  async updateMedicalHistory(patientId: string, medicalHistory: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      throw new AppError("Pasien tidak ditemukan", 404);
    }

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { medicalHistory }
    });

    return updated;
  }

  async getPatients(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' as const } },
        { patientNumber: { contains: search, mode: 'insensitive' as const } },
        { medicalRecordNumber: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search } }
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        select: {
          id: true,
          patientNumber: true,
          medicalRecordNumber: true,
          fullName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          address: true,
          bloodType: true,
          allergies: true,
          medicalHistory: true,
          createdAt: true,
          visits: {
            where: {
              status: 'COMPLETED'
            },
            orderBy: {
              visitDate: 'desc'
            },
            take: 1,
            select: {
              id: true,
              visitNumber: true,
              visitDate: true,
              chiefComplaint: true,
              treatments: {
                take: 1,
                orderBy: {
                  createdAt: 'desc'
                },
                select: {
                  diagnosis: true,
                  service: {
                    select: {
                      serviceName: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.patient.count({ where })
    ]);

    const patientsWithLastVisit = patients.map(p => ({
      ...p,
      lastVisit: p.visits[0]?.visitDate,
      lastVisitId: p.visits[0]?.id,
      lastVisitNumber: p.visits[0]?.visitNumber,
      chiefComplaint: p.visits[0]?.chiefComplaint,
      lastDiagnosis: p.medicalHistory || p.visits[0]?.treatments?.[0]?.diagnosis,
      lastServiceName: p.visits[0]?.treatments?.[0]?.service?.serviceName,
      visits: undefined
    }));

    return {
      patients: patientsWithLastVisit,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: {
          where: {
            status: 'COMPLETED'
          },
          include: {
            nurse: {
              select: {
                fullName: true
              }
            },
            treatments: {
              include: {
                service: true,
                performer: {
                  select: {
                    fullName: true
                  }
                }
              }
            }
          },
          orderBy: {
            visitDate: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            visits: true,
            treatments: true
          }
        }
      }
    });

    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }

    return patient;
  }

  async getPatientRecords(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }

    const treatments = await prisma.treatment.findMany({
      where: { patientId },
      include: {
        visit: {
          select: {
            visitNumber: true,
            visitDate: true
          }
        },
        service: {
          select: {
            serviceName: true,
            category: true
          }
        },
        performer: {
          select: {
            fullName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      patient,
      treatments
    };
  }

  async createTreatment(patientId: string, data: any, performedBy: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      throw new AppError('Pasien tidak ditemukan', 404);
    }

    const visit = await prisma.visit.findUnique({
      where: { id: data.visitId }
    });

    if (!visit) {
      throw new AppError('Kunjungan tidak ditemukan', 404);
    }

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      throw new AppError('Layanan tidak ditemukan', 404);
    }

    const subtotal = service.basePrice.toNumber() * data.quantity - (data.discount || 0);

    const treatment = await prisma.treatment.create({
      data: {
        visitId: data.visitId,
        patientId,
        serviceId: data.serviceId,
        performedBy,
        toothNumber: data.toothNumber,
        diagnosis: data.diagnosis,
        treatmentNotes: data.treatmentNotes,
        quantity: data.quantity,
        unitPrice: service.basePrice,
        discount: data.discount || 0,
        subtotal,
        images: data.images || []
      },
      include: {
        service: true,
        performer: {
          select: {
            fullName: true
          }
        }
      }
    });

    await prisma.visit.update({
      where: { id: data.visitId },
      data: {
        totalCost: {
          increment: subtotal
        }
      }
    });

    const commissionAmount = (subtotal * service.commissionRate.toNumber()) / 100;

    await prisma.commission.create({
      data: {
        userId: performedBy,
        treatmentId: treatment.id,
        baseAmount: subtotal,
        commissionRate: service.commissionRate,
        commissionAmount,
        periodMonth: new Date().getMonth() + 1,
        periodYear: new Date().getFullYear()
      }
    });

    return treatment;
  }

  async createPatient(data: any): Promise<any> {
    const existingPatient = await prisma.patient.findFirst({
      where: {
        phone: data.phone
      }
    });

    if (existingPatient) {
      if (!existingPatient.medicalRecordNumber) {
        const medicalRecordNumber = await this.generateMedicalRecordNumber();
        return await prisma.patient.update({
          where: { id: existingPatient.id },
          data: { medicalRecordNumber }
        });
      }
      return existingPatient;
    }

    const patientNumber = await this.generatePatientNumber();
    const medicalRecordNumber = await this.generateMedicalRecordNumber();

    const patient = await prisma.patient.create({
      data: {
        patientNumber,
        medicalRecordNumber,
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
        bloodType: data.bloodType,
        allergies: data.allergies,
        medicalHistory: data.medicalHistory
      }
    });

    return patient;
  }
}