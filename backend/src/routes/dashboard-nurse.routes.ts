import { Router } from 'express';
import { DashboardNurseController } from '../controllers/dashboard-nurse.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const dashboardNurseController = new DashboardNurseController();

router.get(
  '/summary',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  dashboardNurseController.getSummary
);

export default router;