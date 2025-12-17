
import { Router } from 'express';
import { getPrediction, chatTika } from '../controllers/ai.controller';

const router = Router();

router.get('/predict', getPrediction);
router.post('/chat', chatTika);

export default router;
