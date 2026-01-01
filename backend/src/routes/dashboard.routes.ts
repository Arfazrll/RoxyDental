import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const dashboardController = new DashboardController();

router.get(
  '/summary',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  dashboardController.getSummary
);

export default router;