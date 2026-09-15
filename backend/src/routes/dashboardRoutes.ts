import { Router } from 'express';
import {
  getSummary,
  getRevenueExpenses,
  getCategories,
  getDashboardMetrics,
} from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/', getDashboardMetrics);
router.get('/summary', getSummary);
router.get('/revenue-expenses', getRevenueExpenses);
router.get('/categories', getCategories);

export default router;
