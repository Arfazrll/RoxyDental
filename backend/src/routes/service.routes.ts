import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '../../generated/prisma';

const router = Router();
const serviceController = new ServiceController();

// All authenticated users can view services
router.get(
  '/',
  authMiddleware,
  serviceController.getServices
);

router.get(
  '/:id',
  authMiddleware,
  serviceController.getServiceById
);

// Only doctors can manage services (or remove these routes if not needed)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER), // Changed from ADMIN
  serviceController.createService
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER), // Changed from ADMIN
  serviceController.updateService
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER), // Changed from ADMIN
  serviceController.deleteService
);

export default router;