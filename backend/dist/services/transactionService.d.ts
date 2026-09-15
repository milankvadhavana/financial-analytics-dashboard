import { ITransaction } from '../models/Transaction';
interface QueryParams {
    search?: string;
    category?: string;
    status?: string;
    user_id?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export declare class TransactionService {
    static findAll(params: QueryParams): Promise<{
        data: (ITransaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getDashboardMetrics(): Promise<{
        summary: {
            totalRevenue: any;
            totalExpenses: any;
            netProfit: number;
            totalTransactions: any;
            pendingCount: any;
        };
        monthlyTrends: any[];
        categoryBreakdown: any;
    }>;
    static getFilterOptions(): Promise<{
        categories: NonNullable<"Revenue" | "Expense">[];
        statuses: NonNullable<"Paid" | "Pending">[];
        users: string[];
    }>;
}
export {};
//# sourceMappingURL=transactionService.d.ts.map