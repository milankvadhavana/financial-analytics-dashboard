"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const Transaction_1 = __importStar(require("../models/Transaction"));
class TransactionService {
    static async findAll(params) {
        const { search, category, status, user_id, startDate, endDate, minAmount, maxAmount, sortBy = 'date', sortOrder = 'desc', page = 1, limit = 10 } = params;
        const query = {};
        // Multi-field filters
        if (category)
            query.category = category;
        if (status)
            query.status = status;
        if (user_id)
            query.user_id = user_id;
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        if (minAmount !== undefined || maxAmount !== undefined) {
            query.amount = {};
            if (minAmount !== undefined)
                query.amount.$gte = minAmount;
            if (maxAmount !== undefined)
                query.amount.$lte = maxAmount;
        }
        // Real-time search across multiple fields
        if (search) {
            query.$or = [
                { user_id: { $regex: search, $options: 'i' } },
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
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const [transactions, total] = await Promise.all([
            Transaction_1.default.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            Transaction_1.default.countDocuments(query)
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
    static async getDashboardMetrics() {
        const [metrics] = await Transaction_1.default.aggregate([
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalRevenue: {
                                    $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] }
                                },
                                totalExpenses: {
                                    $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] }
                                },
                                totalTransactions: { $sum: 1 },
                                pendingCount: {
                                    $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    monthlyTrends: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$date' },
                                    month: { $month: '$date' },
                                    category: '$category'
                                },
                                total: { $sum: '$amount' }
                            }
                        },
                        { $sort: { '_id.year': 1, '_id.month': 1 } }
                    ],
                    categoryBreakdown: [
                        {
                            $group: {
                                _id: '$category',
                                total: { $sum: '$amount' },
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);
        // Transform monthly trends
        const monthlyMap = new Map();
        metrics.monthlyTrends.forEach((item) => {
            const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, { month: key, revenue: 0, expenses: 0 });
            }
            const entry = monthlyMap.get(key);
            if (item._id.category === 'Revenue')
                entry.revenue = item.total;
            else
                entry.expenses = item.total;
        });
        return {
            summary: {
                totalRevenue: metrics.summary[0]?.totalRevenue || 0,
                totalExpenses: metrics.summary[0]?.totalExpenses || 0,
                netProfit: (metrics.summary[0]?.totalRevenue || 0) -
                    (metrics.summary[0]?.totalExpenses || 0),
                totalTransactions: metrics.summary[0]?.totalTransactions || 0,
                pendingCount: metrics.summary[0]?.pendingCount || 0
            },
            monthlyTrends: Array.from(monthlyMap.values()),
            categoryBreakdown: metrics.categoryBreakdown
        };
    }
    static async getFilterOptions() {
        const [categories, statuses, users] = await Promise.all([
            Transaction_1.default.distinct('category'),
            Transaction_1.default.distinct('status'),
            Transaction_1.default.distinct('user_id')
        ]);
        return { categories, statuses, users };
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transactionService.js.map