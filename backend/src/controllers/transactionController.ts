import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { TransactionService } from '../services/transactionService';
import { CSVService } from '../services/csvService';

export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await TransactionService.findAll({
      search: req.query.search as string,
      category: req.query.category as string,
      status: req.query.status as string,
      user_id: req.query.user_id as string,
      user: req.query.user as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
      maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardMetrics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = await TransactionService.getDashboardMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFilterOptions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const options = await TransactionService.getFilterOptions();
    res.json(options);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const exportCSV = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { columns, filters } = req.body;
    
    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      return res.status(400).json({ error: 'At least one column required' });
    }

    await CSVService.generateAndSend(res, { columns, filters });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};