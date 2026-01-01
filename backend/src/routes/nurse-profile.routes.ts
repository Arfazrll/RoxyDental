import { Router } from 'express';
import { NurseProfileController } from '../controllers/nurse-profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateProfileSchema } from '../validators/profile.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const nurseProfileController = new NurseProfileController();

router.get(
  '/profile',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  nurseProfileController.getProfile.bind(nurseProfileController)
);

router.put(
  '/profile',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  validate(updateProfileSchema),
  nurseProfileController.updateProfile.bind(nurseProfileController)
);

router.get(
  '/profile/completion',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  nurseProfileController.getProfileCompletion.bind(nurseProfileController)
);

router.get(
  '/profile/shift-status',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  nurseProfileController.getCurrentShiftStatus.bind(nurseProfileController)
);

router.get(
  '/profile/account-status',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  nurseProfileController.getAccountStatus.bind(nurseProfileController)
);

router.get(
  '/profile/license',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  nurseProfileController.getLicenseInfo.bind(nurseProfileController)
);

router.delete(
  '/account',
  authMiddleware,
  roleMiddleware(UserRole.PERAWAT),
  nurseProfileController.deleteAccount.bind(nurseProfileController)
);

export default router;