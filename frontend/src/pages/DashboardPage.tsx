import { useEffect, useState } from 'react';
import {
  Box, Stack, Typography, Skeleton
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useAlerts } from '../hooks/useAlerts';
import { dashboardService } from '../services/dashboardService';
import { authService } from '../services/authService';
import type { DashboardMetrics } from '../types';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import RevenueExpenseChart from '../components/RevenueExpenseChart';
import CategoryChart from '../components/CategoryChart';
import TransactionTable from '../components/TransactionTable';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { showAlert } = useAlerts();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getDashboard();
      setMetrics(data);
    } catch (error: any) {
      showAlert(
        error.response?.data?.error || 'Failed to load metrics',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD'
    }).format(v);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    showAlert('Logged out successfully', 'success');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617, #0f172a 55%, #111827)' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, letterSpacing: '-0.05em' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
              Summary metrics, trends, categories, and transaction controls powered by the backend APIs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            }}
          >
            {loading && !metrics
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Box key={index}>
                    <Skeleton variant="rounded" height={140} />
                  </Box>
                ))
              : (
                <>
                  <SummaryCard title="Total Revenue" value={formatCurrency(metrics?.summary.totalRevenue || 0)} tone="success" />
                  <SummaryCard title="Total Expenses" value={formatCurrency(metrics?.summary.totalExpenses || 0)} tone="error" />
                  <SummaryCard title="Net Profit" value={formatCurrency(metrics?.summary.netProfit || 0)} tone="primary" />
                  <SummaryCard title="Transactions" value={String(metrics?.summary.totalTransactions || 0)} helper={`${metrics?.summary.pendingCount || 0} pending`} />
                </>
              )}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
            }}
          >
            <Box>
              <RevenueExpenseChart data={metrics?.monthlyTrends || []} loading={loading && !metrics} />
            </Box>
            <Box>
              <CategoryChart data={metrics?.categoryBreakdown || []} loading={loading && !metrics} />
            </Box>
          </Box>

          <TransactionTable />
        </Stack>
      </Box>
    </Box>
  );
}