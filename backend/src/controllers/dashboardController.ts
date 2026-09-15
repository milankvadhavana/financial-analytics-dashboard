import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { TransactionService } from '../services/transactionService';

export const getSummary = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const summary = await TransactionService.getDashboardSummary();
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRevenueExpenses = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const trend = await TransactionService.getRevenueExpenses();
    res.json(trend);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await TransactionService.getCategoryBreakdown();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardMetrics = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = await TransactionService.getDashboardMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
