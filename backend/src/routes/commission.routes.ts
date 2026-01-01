import { Router } from 'express';
import { CommissionController } from '../controllers/commission.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const commissionController = new CommissionController();

router.get(
  '/summary',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  commissionController.getSummary
);
router.get(
  '/services',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  commissionController.getServices
);
router.get(
  '/pharmacy',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  commissionController.getPharmacy
);
router.get(
  '/packages',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  commissionController.getPackages
);
router.get(
  '/labs',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  commissionController.getLabs
);

export default router;