import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '../../generated/prisma';

const router = Router();
const financeController = new FinanceController();

router.get(
  '/reports',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  financeController.getFinanceReports.bind(financeController)
);

router.post(
  '/reports',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  financeController.createFinanceReport.bind(financeController)
);

router.get(
  '/procedures',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  financeController.getProcedures.bind(financeController)
);

router.post(
  '/procedures',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  financeController.createProcedure.bind(financeController)
);

router.get(
  '/packages',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  financeController.getPackages.bind(financeController)
);

router.post(
  '/packages',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  financeController.createPackage.bind(financeController)
);

export default router;