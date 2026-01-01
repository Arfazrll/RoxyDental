import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { CommissionService } from '../services/commission.service';
import { successResponse } from '../utils/response.util';
import { ServiceCategory } from '@prisma/client';

const commissionService = new CommissionService();

export class CommissionController {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const summary = await commissionService.getSummary(
        req.user!.id,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );
      res.json(successResponse('Summary komisi berhasil diambil', summary));
    } catch (error) {
      next(error);
    }
  }

  async getServices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const data = await commissionService.getByCategory(
        req.user!.id,
        ServiceCategory.CONSULTATION,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );
      res.json(successResponse('Komisi layanan berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }

  async getPharmacy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const data = await commissionService.getByCategory(
        req.user!.id,
        ServiceCategory.OTHER,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );
      res.json(successResponse('Komisi farmasi berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }

  async getPackages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const data = await commissionService.getByCategory(
        req.user!.id,
        ServiceCategory.ORTHODONTIC,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );
      res.json(successResponse('Komisi paket berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }

  async getLabs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const data = await commissionService.getByCategory(
        req.user!.id,
        ServiceCategory.OTHER,
        month ? Number(month) : undefined,
        year ? Number(year) : undefined
      );
      res.json(successResponse('Komisi laboratorium berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }
}