import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

interface CreateFinanceReportData {
  tipe: string;
  nama: string;
  prosedur?: string;
  potongan: number;
  bhpHarga: number;
  bhpKomisi: number;
  farmasiHarga: number;
  farmasiKomisi: number;
  paketHarga: number;
  paketKomisi: number;
  labHarga: number;
  labKomisi: number;
}

interface CreateProcedureData {
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  avgComm: string;
}

interface CreatePackageData {
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  avgComm: string;
}

export class FinanceService {
  async getFinanceReports(userId: string, search?: string) {
    const where: any = { userId };
    if (search) {
      where.nama = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const reports = await prisma.financeReport.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const total = {
      potongan: reports.reduce((sum, r) => sum + r.potongan.toNumber(), 0),
      bhpHarga: reports.reduce((sum, r) => sum + r.bhpHarga.toNumber(), 0),
      farmasiHarga: reports.reduce((sum, r) => sum + r.farmasiHarga.toNumber(), 0),
      paketHarga: reports.reduce((sum, r) => sum + r.paketHarga.toNumber(), 0),
      labHarga: reports.reduce((sum, r) => sum + r.labHarga.toNumber(), 0)
    };

    return { reports, total };
  }

  async createFinanceReport(userId: string, data: CreateFinanceReportData) {
    const report = await prisma.financeReport.create({
      data: {
        userId,
        ...data
      }
    });

    return report;
  }

  async getProcedures(userId: string, search?: string) {
    const where: any = { userId };
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const procedures = await prisma.procedure.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const total = {
      totalSale: procedures.reduce((sum, p) => sum + p.totalSale.toNumber(), 0),
      totalComm: procedures.reduce((sum, p) => sum + p.totalComm.toNumber(), 0)
    };

    return { procedures, total };
  }

  async createProcedure(userId: string, data: CreateProcedureData) {
    const existingCode = await prisma.procedure.findUnique({
      where: { code: data.code }
    });

    if (existingCode) {
      throw new AppError('Kode prosedur sudah digunakan', 400);
    }

    const qty = Number(data.quantity);
    const sale = Number(data.salePrice);
    const avg = parseFloat(data.avgComm);
    const totalSale = qty * sale;
    const totalComm = Math.round((totalSale * avg) / 100);

    const procedure = await prisma.procedure.create({
      data: {
        userId,
        name: data.name,
        code: data.code,
        quantity: qty,
        salePrice: sale,
        avgComm: avg,
        totalSale,
        totalComm
      }
    });

    return procedure;
  }

  async getPackages(userId: string, search?: string) {
    const where: any = { userId };
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const total = {
      totalSale: packages.reduce((sum, p) => sum + p.totalSale.toNumber(), 0),
      totalComm: packages.reduce((sum, p) => sum + p.totalComm.toNumber(), 0)
    };

    return { packages, total };
  }

  async createPackage(userId: string, data: CreatePackageData) {
    const existingSku = await prisma.package.findUnique({
      where: { sku: data.sku }
    });

    if (existingSku) {
      throw new AppError('SKU sudah digunakan', 400);
    }

    const qty = Number(data.quantity);
    const sale = Number(data.salePrice);
    const avg = parseFloat(data.avgComm);
    const totalSale = qty * sale;
    const totalComm = Math.round((totalSale * avg) / 100);

    const packageItem = await prisma.package.create({
      data: {
        userId,
        name: data.name,
        sku: data.sku,
        quantity: qty,
        salePrice: sale,
        avgComm: avg,
        totalSale,
        totalComm
      }
    });

    return packageItem;
  }
}