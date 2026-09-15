export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Transaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

export interface DashboardMetrics {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalTransactions: number;
    pendingCount: number;
  };
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
  }>;
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

export interface TransactionFilters {
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}