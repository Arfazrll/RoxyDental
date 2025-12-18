import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import dashboardNurseRoutes from './dashboard-nurse.routes';
import visitRoutes from './visit.routes';
import patientRoutes from './patient.routes';
import scheduleRoutes from './schedule.routes';
import leaveRoutes from './leave.routes';
import commissionRoutes from './commission.routes';
import paymentRoutes from './payment.routes';
import userRoutes from './user.routes';
import treatmentRoutes from './treatment.routes';
import nurseProfileRoutes from './nurse-profile.routes';
import financeRoutes from './finance.routes';
import medicationRoutes from './medication.routes';
import nurseVisitRoutes from './nurse-visit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctor/dashboard', dashboardRoutes);
router.use('/nurse/dashboard', dashboardNurseRoutes);
router.use('/nurse', nurseProfileRoutes);
router.use('/doctor/visits', visitRoutes);
router.use('/doctor/patients', patientRoutes);
router.use('/doctor/treatments', treatmentRoutes);
router.use('/doctor/schedules', scheduleRoutes);
router.use('/doctor/leaves', leaveRoutes);
router.use('/doctor/finance/commissions', commissionRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/doctor/finance', financeRoutes);
router.use('/medications', medicationRoutes);
router.use('/nurse/visits', nurseVisitRoutes);

export default router;