import { createObjectCsvStringifier } from 'csv-writer';
import { Response } from 'express';
import Transaction from '../models/Transaction';

interface ExportConfig {
  columns: string[];
  filters?: any;
}

const COLUMN_MAP: Record<string, { id: string; title: string }> = {
  id: { id: 'id', title: 'ID' },
  date: { id: 'date', title: 'Date' },
  amount: { id: 'amount', title: 'Amount' },
  category: { id: 'category', title: 'Category' },
  status: { id: 'status', title: 'Status' },
  user_id: { id: 'user_id', title: 'User ID' },
};

export class CSVService {
  static async generateAndSend(
    res: Response,
    config: ExportConfig
  ) {
    const { columns, filters = {} } = config;

    // Validate columns
    const validColumns = columns.filter(col => COLUMN_MAP[col]);
    if (validColumns.length === 0) {
      throw new Error('No valid columns selected');
    }

    const query = this.buildQuery(filters);
    const transactions = await Transaction.find(query).lean();

    // Format data
    const formattedData = transactions.map(t => {
      const row: any = {};
      validColumns.forEach(col => {
        if (col === 'date') {
          row[col] = new Date(t.date).toISOString().split('T')[0];
        } else {
          row[col] = (t as any)[col];
        }
      });
      return row;
    });

    const csvStringifier = createObjectCsvStringifier({
      header: validColumns.map(col => COLUMN_MAP[col])
    });

    const csvContent = 
      csvStringifier.getHeaderString() + 
      csvStringifier.stringifyRecords(formattedData);

    const filename = `transactions_${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename="${filename}"`
    );
    res.status(200).send(csvContent);
  }

  private static buildQuery(filters: any) {
    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.user_id) query.user_id = filters.user_id;
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }
    return query;
  }
}