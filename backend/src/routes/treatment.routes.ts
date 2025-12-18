import { Router } from 'express';
import { TreatmentController } from '../controllers/treatment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { uploadMiddleware } from '../middlewares/Upload.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateTreatmentSchema } from '../validators/treatment.validator';
import { UserRole } from '../../generated/prisma';

const router = Router();
const treatmentController = new TreatmentController();

router.get(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  treatmentController.getTreatments
);

router.get(
  '/:id',
  authMiddleware,
  treatmentController.getTreatmentById
);

router.get(
  '/visit/:visitId',
  authMiddleware,
  treatmentController.getTreatmentsByVisit
);

router.get(
  '/visit/:visitId/full',
  authMiddleware,
  treatmentController.getVisitWithTreatments
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  treatmentController.createTreatment
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  validate(updateTreatmentSchema),
  treatmentController.updateTreatment
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  treatmentController.deleteTreatment
);

router.post(
  '/upload-images',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  uploadMiddleware.array('images', 5),
  treatmentController.uploadImages
);

export default router;