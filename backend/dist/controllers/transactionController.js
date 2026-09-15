"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCSV = exports.getFilterOptions = exports.getDashboardMetrics = exports.getTransactions = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const transactionService_1 = require("../services/transactionService");
const csvService_1 = require("../services/csvService");
const getTransactions = async (req, res) => {
    try {
        const result = await transactionService_1.TransactionService.findAll({
            search: req.query.search,
            category: req.query.category,
            status: req.query.status,
            user_id: req.query.user_id,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
            maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTransactions = getTransactions;
const getDashboardMetrics = async (req, res) => {
    try {
        const metrics = await transactionService_1.TransactionService.getDashboardMetrics();
        res.json(metrics);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getDashboardMetrics = getDashboardMetrics;
const getFilterOptions = async (req, res) => {
    try {
        const options = await transactionService_1.TransactionService.getFilterOptions();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getFilterOptions = getFilterOptions;
const exportCSV = async (req, res) => {
    try {
        const { columns, filters } = req.body;
        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            return res.status(400).json({ error: 'At least one column required' });
        }
        await csvService_1.CSVService.generateAndSend(res, { columns, filters });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.exportCSV = exportCSV;
//# sourceMappingURL=transactionController.js.map