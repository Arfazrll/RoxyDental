import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { FinanceService } from '../services/finance.service';
import { successResponse } from '../utils/response.util';

const financeService = new FinanceService();

export class FinanceController {
  async getFinanceReports(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const data = await financeService.getFinanceReports(
        req.user!.id,
        search as string
      );
      res.json(successResponse('Data laporan keuangan berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }

  async createFinanceReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await financeService.createFinanceReport(req.user!.id, req.body);
      res.status(201).json(successResponse('Laporan keuangan berhasil ditambahkan', report));
    } catch (error) {
      next(error);
    }
  }

  async getProcedures(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const data = await financeService.getProcedures(
        req.user!.id,
        search as string
      );
      res.json(successResponse('Data prosedur berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }

  async createProcedure(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const procedure = await financeService.createProcedure(req.user!.id, req.body);
      res.status(201).json(successResponse('Prosedur berhasil ditambahkan', procedure));
    } catch (error) {
      next(error);
    }
  }

  async getPackages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const data = await financeService.getPackages(
        req.user!.id,
        search as string
      );
      res.json(successResponse('Data paket berhasil diambil', data));
    } catch (error) {
      next(error);
    }
  }

  async createPackage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const packageItem = await financeService.createPackage(req.user!.id, req.body);
      res.status(201).json(successResponse('Paket berhasil ditambahkan', packageItem));
    } catch (error) {
      next(error);
    }
  }
}