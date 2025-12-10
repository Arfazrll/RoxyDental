import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getMyLeaveRequests,
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  getCalendarEvents,
  getMyCalendarEvents
} from '../controllers/calendar.controller';

const router = Router();

router.use(authenticate);

router.get('/leaves', getAllLeaveRequests);
router.get('/my-leaves', getMyLeaveRequests);
router.post('/leave', createLeaveRequest);
router.put('/leave/:id', updateLeaveRequest);
router.delete('/leave/:id', deleteLeaveRequest);

router.get('/events', getCalendarEvents);
router.get('/my-events', getMyCalendarEvents);

export default router;