import api from './api';
import type {
  Transaction, DashboardMetrics,
  TransactionFilters, PaginatedResponse
} from '../types';

export const transactionService = {
  async getTransactions(
    filters: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await api.get(`/transactions?${params}`);
    return data;
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const { data } = await api.get('/transactions/dashboard');
    return data;
  },

  async getFilterOptions() {
    const { data } = await api.get('/transactions/filters');
    return data;
  },

  async exportCSV(columns: string[], filters: any) {
    const response = await api.post(
      '/transactions/export/csv',
      { columns, filters },
      { responseType: 'blob' }
    );

    // Auto-download directly in browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};