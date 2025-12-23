import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createPaymentSchema, updatePaymentSchema } from '../validators/payment.validator';

const router = Router();
const paymentController = new PaymentController();

router.post('/', authMiddleware, validate(createPaymentSchema), paymentController.createPayment.bind(paymentController));
router.put('/:id', authMiddleware, validate(updatePaymentSchema), paymentController.updatePayment.bind(paymentController));
router.get('/', authMiddleware, paymentController.getAllPayments.bind(paymentController));
router.get('/visit/:visitId', authMiddleware, paymentController.getPaymentsByVisit.bind(paymentController));
router.get('/:id', authMiddleware, paymentController.getPaymentById.bind(paymentController));

export default router;