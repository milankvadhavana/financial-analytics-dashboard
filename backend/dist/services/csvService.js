"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVService = void 0;
const csv_writer_1 = require("csv-writer");
const express_1 = require("express");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const COLUMN_MAP = {
    id: { id: 'id', title: 'ID' },
    date: { id: 'date', title: 'Date' },
    amount: { id: 'amount', title: 'Amount' },
    category: { id: 'category', title: 'Category' },
    status: { id: 'status', title: 'Status' },
    user_id: { id: 'user_id', title: 'User ID' },
};
class CSVService {
    static async generateAndSend(res, config) {
        const { columns, filters = {} } = config;
        // Validate columns
        const validColumns = columns.filter(col => COLUMN_MAP[col]);
        if (validColumns.length === 0) {
            throw new Error('No valid columns selected');
        }
        const query = this.buildQuery(filters);
        const transactions = await Transaction_1.default.find(query).lean();
        // Format data
        const formattedData = transactions.map(t => {
            const row = {};
            validColumns.forEach(col => {
                if (col === 'date') {
                    row[col] = new Date(t.date).toISOString().split('T')[0];
                }
                else {
                    row[col] = t[col];
                }
            });
            return row;
        });
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
            header: validColumns.map(col => COLUMN_MAP[col])
        });
        const csvContent = csvStringifier.getHeaderString() +
            csvStringifier.stringifyRecords(formattedData);
        const filename = `transactions_${Date.now()}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csvContent);
    }
    static buildQuery(filters) {
        const query = {};
        if (filters.category)
            query.category = filters.category;
        if (filters.status)
            query.status = filters.status;
        if (filters.user_id)
            query.user_id = filters.user_id;
        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate)
                query.date.$gte = new Date(filters.startDate);
            if (filters.endDate)
                query.date.$lte = new Date(filters.endDate);
        }
        return query;
    }
}
exports.CSVService = CSVService;
//# sourceMappingURL=csvService.js.map