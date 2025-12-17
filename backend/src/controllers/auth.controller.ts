import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.types';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response.util';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(successResponse('Login berhasil', result));
    } catch (error) {
      next(error);
    }
  }

  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(successResponse('Registrasi berhasil', result));
    } catch (error) {
      next(error);
    }
  }

  async registerDoctor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerDoctor(req.body);
      res.status(201).json(successResponse('Registrasi dokter berhasil', result));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);
      res.json(successResponse('Link reset password telah dikirim ke email Anda'));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, token, newPassword } = req.body;
      await authService.resetPassword(email, token, newPassword);
      res.json(successResponse('Password berhasil direset'));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(req.user!.id, req.body);
      res.json(successResponse('Password berhasil diubah'));
    } catch (error) {
      next(error);
    }
  }

  async seedDoctor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      try {
        const result = await authService.registerDoctor({
          username: 'dokter1',
          email: 'dokter1@roxydental.com',
          password: 'password123',
          fullName: 'Dr. Roxy',
          phone: '08123456789',
          specialization: 'Gigi Umum',
        });
        res.json(successResponse('SEED SUCCESS: Akun dokter berhasil dibuat. Login: dokter1 / password123', result));
      } catch (err: any) {
        if (err.message && (err.message.includes('already exists') || err.message.includes('sudah digunakan'))) {
          res.json(successResponse('INFO: Akun dokter sudah ada. Login: dokter1 / password123'));
          return;
        }
        res.status(500).json({
          success: false,
          message: err.message || 'Unknown Error',
          stack: err.stack,
          context: 'Inside seedDoctor inner catch'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Unknown Global Error',
        stack: error.stack,
        context: 'Inside seedDoctor outer catch'
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      res.json(successResponse('Data user berhasil diambil', user));
    } catch (error) {
      next(error);
    }
  }
}