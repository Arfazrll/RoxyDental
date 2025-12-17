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

router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.get('/seed-doctor', authController.seedDoctor.bind(authController));
router.post('/register-doctor', validate(registerSchema), authController.registerDoctor.bind(authController));
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword.bind(authController));
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword.bind(authController));
router.put('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword.bind(authController));
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));

export default router;