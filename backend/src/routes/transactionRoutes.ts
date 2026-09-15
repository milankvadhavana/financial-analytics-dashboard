import { Router } from 'express';
import {
  getTransactions,
  getDashboardMetrics,
  getFilterOptions,
  exportCSV
} from '../controllers/transactionController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/', getTransactions);
router.get('/dashboard', getDashboardMetrics);
router.get('/filters', getFilterOptions);
router.post('/export/csv', exportCSV);

export default router;