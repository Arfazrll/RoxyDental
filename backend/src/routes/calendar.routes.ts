import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getMyLeaveRequests,
  getAllLeaveRequests,
  getPendingLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getCalendarEvents,
  getMyCalendarEvents
} from '../controllers/calendar.controller';

const router = Router();

router.use(authenticate);

router.get('/leaves', getAllLeaveRequests);
router.get('/my-leaves', getMyLeaveRequests);
router.get('/pending-leaves', getPendingLeaveRequests);
router.post('/leave', createLeaveRequest);
router.put('/leave/:id', updateLeaveRequest);
router.delete('/leave/:id', deleteLeaveRequest);
router.post('/leave/:id/approve', approveLeaveRequest);
router.post('/leave/:id/reject', rejectLeaveRequest);

router.get('/events', getCalendarEvents);
router.get('/my-events', getMyCalendarEvents);

export default router;