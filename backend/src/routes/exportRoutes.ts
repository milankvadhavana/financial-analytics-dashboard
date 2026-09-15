import { Router } from 'express';
import { exportCSV } from '../controllers/transactionController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.post('/csv', exportCSV);

export default router;
