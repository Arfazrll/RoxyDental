import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
import { successResponse } from '../utils/response.util';

const serviceService = new ServiceService();

export class ServiceController {
  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, category, search } = req.query;
      const result = await serviceService.getServices(
        Number(page) || 1,
        Number(limit) || 50,
        category as string,
        search as string
      );
      res.json(successResponse('Daftar layanan berhasil diambil', result));
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      res.json(successResponse('Detail layanan berhasil diambil', service));
    } catch (error) {
      next(error);
    }
  }

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.createService(req.body);
      res.status(201).json(successResponse('Layanan berhasil ditambahkan', service));
    } catch (error) {
      next(error);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.updateService(req.params.id, req.body);
      res.json(successResponse('Layanan berhasil diupdate', service));
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      await serviceService.deleteService(req.params.id);
      res.json(successResponse('Layanan berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}