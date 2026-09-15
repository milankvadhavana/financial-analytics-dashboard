import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getTransactions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDashboardMetrics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFilterOptions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportCSV: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
