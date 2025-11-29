import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  resetPasswordSchema
} from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/register-doctor', validate(registerSchema), authController.registerDoctor);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.put('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;