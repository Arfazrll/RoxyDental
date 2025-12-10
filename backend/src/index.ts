import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { emailService } from './utils/email.util';
import calendarRoutes from './routes/calendar.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/api/calendar', calendarRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

setInterval(async () => {
  try {
    await emailService.cleanupExpiredTokens();
    console.log('Expired tokens cleaned up');
  } catch (error) {
    console.error('Failed to cleanup tokens:', error);
  }
}, 3600000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});