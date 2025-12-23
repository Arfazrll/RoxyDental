import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { PaymentService } from '../services/payment.service';
import { successResponse } from '../utils/response.util';

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.createPayment(req.body);
      res.status(201).json(successResponse('Pembayaran berhasil dibuat', payment));
    } catch (error) {
      next(error);
    }
  }

  async updatePayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.updatePayment(req.params.id, req.body);
      res.json(successResponse('Pembayaran berhasil diupdate', payment));
    } catch (error) {
      next(error);
    }
  }

  async getPaymentsByVisit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payments = await paymentService.getPaymentsByVisit(req.params.visitId);
      res.json(successResponse('Daftar pembayaran berhasil diambil', payments));
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;
      const payments = await paymentService.getAllPayments(search as string);
      res.json(successResponse('Daftar pembayaran berhasil diambil', payments));
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      res.json(successResponse('Detail pembayaran berhasil diambil', payment));
    } catch (error) {
      next(error);
    }
  }
}