import api from './api';
import type { DashboardMetrics } from '../types';

export const dashboardService = {
  async getSummary(): Promise<DashboardMetrics['summary']> {
    const { data } = await api.get('/dashboard/summary');
    return data;
  },

  async getRevenueExpenses(): Promise<DashboardMetrics['monthlyTrends']> {
    const { data } = await api.get('/dashboard/revenue-expenses');
    return data;
  },

  async getCategories(): Promise<DashboardMetrics['categoryBreakdown']> {
    const { data } = await api.get('/dashboard/categories');
    return data;
  },

  async getDashboard(): Promise<DashboardMetrics> {
    const { data } = await api.get('/dashboard');
    return data;
  },
};
