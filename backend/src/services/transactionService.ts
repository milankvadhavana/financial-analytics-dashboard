import Transaction, { ITransaction } from '../models/Transaction';

interface QueryParams {
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  user?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class TransactionService {
  static async findAll(params: QueryParams) {
    const {
      search, category, status, user_id, user,
      startDate, endDate, minAmount, maxAmount,
      sortBy = 'date', sortOrder = 'desc',
      page = 1, limit = 10
    } = params;

    const query: any = {};

    // Multi-field filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (user_id) {
      query.user_id = user_id;
    } else if (user) {
      query.$or = [
        ...(query.$or || []),
        { user_id: { $regex: user, $options: 'i' } },
        { user_profile: { $regex: user, $options: 'i' } },
      ];
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) query.amount.$gte = minAmount;
      if (maxAmount !== undefined) query.amount.$lte = maxAmount;
    }

    // Real-time search across multiple fields
    if (search) {
      query.$or = [
        { user_id: { $regex: search, $options: 'i' } },
        { user_profile: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
      
      // Search by amount if numeric
      const numSearch = parseFloat(search);
      if (!isNaN(numSearch)) {
        query.$or.push({ amount: numSearch });
      }
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query)
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getDashboardSummary() {
    const [metrics] = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
          },
          transactionCount: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const summary = metrics || {};

    return {
      totalRevenue: summary.totalRevenue || 0,
      totalExpenses: summary.totalExpenses || 0,
      netProfit: (summary.totalRevenue || 0) - (summary.totalExpenses || 0),
      totalTransactions: summary.transactionCount || 0,
      transactionCount: summary.transactionCount || 0,
      pendingCount: summary.pendingCount || 0
    };
  }

  static async getRevenueExpenses() {
    const records = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          revenue: {
            $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
          },
          expenses: {
            $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
          },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return records.map((record: any) => {
      const monthDate = new Date(record._id.year, record._id.month - 1, 1);
      const month = monthDate.toLocaleString('en-US', { month: 'long' });
      return {
        month,
        revenue: record.revenue,
        expenses: record.expenses,
      };
    });
  }

  static async getCategoryBreakdown() {
    const categories = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return categories.map((item: any) => ({
      category: item._id,
      amount: item.amount,
      count: item.count,
      _id: item._id,
      total: item.amount,
    }));
  }

  static async getDashboardMetrics() {
    const [summary, monthlyTrends, categoryBreakdown] = await Promise.all([
      this.getDashboardSummary(),
      this.getRevenueExpenses(),
      this.getCategoryBreakdown(),
    ]);

    return {
      summary,
      monthlyTrends,
      categoryBreakdown,
    };
  }

  static async getFilterOptions() {
    const [categories, statuses, users] = await Promise.all([
      Transaction.distinct('category'),
      Transaction.distinct('status'),
      Transaction.distinct('user_id')
    ]);
    return { categories, statuses, users };
  }
}