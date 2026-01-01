import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const userController = new UserController();

router.get(
  '/profile',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.getProfile(req, res, next)
);

router.put(
  '/profile',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.updateProfile(req, res, next)
);

router.delete(
  '/account',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.deleteAccount(req, res, next)
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.getAllUsers(req, res, next)
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.getUserById(req, res, next)
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.createUser(req, res, next)
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.updateUser(req, res, next)
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.deleteUser(req, res, next)
);

router.patch(
  '/:id/toggle-status',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  (req, res, next) => userController.toggleUserStatus(req, res, next)
);

export default router;