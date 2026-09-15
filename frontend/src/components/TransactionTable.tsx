import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  Download,
  Clear,
  Refresh,
} from '@mui/icons-material';
import { transactionService } from '../services/transactionService';
import { useAlerts } from '../hooks/useAlerts';
import type { Transaction, TransactionFilters } from '../types';
import ExportModal from './ExportModal';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';

const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  category: '',
  status: '',
  user_id: '',
  startDate: '',
  endDate: '',
  minAmount: undefined,
  maxAmount: undefined,
  sortBy: 'date',
  sortOrder: 'desc',
};

export default function TransactionTable() {
  const { showAlert } = useAlerts();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    categories: string[];
    statuses: string[];
    users: string[];
  }>({ categories: [], statuses: [], users: [] });

  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');

  // Debounce search input → filters.search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) =>
        f.search === searchInput ? f : { ...f, search: searchInput }
      );
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transactionService.getTransactions({
        ...filters,
        page,
        limit: pageSize,
      });
      setTransactions(result.data);
      setTotal(result.pagination.total);
    } catch (error: any) {
      showAlert(
        error.response?.data?.error || 'Failed to load transactions',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, showAlert]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Load filter dropdown options once
  useEffect(() => {
    transactionService
      .getFilterOptions()
      .then(setFilterOptions)
      .catch(() => showAlert('Failed to load filter options', 'warning'));
  }, [showAlert]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setPage(1);
  };

  // ✅ Count only real filters (exclude sort + pagination)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.user_id) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.minAmount !== undefined) count++;
    if (filters.maxAmount !== undefined) count++;
    return count;
  }, [filters]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(v);

  const toggleSort = (field: 'date' | 'amount') => {
    setFilters((current) => {
      const isSame = current.sortBy === field;
      const nextOrder =
        isSame && current.sortOrder === 'asc' ? 'desc' : 'asc';
      return { ...current, sortBy: field, sortOrder: nextOrder };
    });
    setPage(1);
  };

  const sortIndicator = (field: 'date' | 'amount') => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? (
      <ArrowUpward fontSize="small" sx={{ color: '#a5b4fc' }} />
    ) : (
      <ArrowDownward fontSize="small" sx={{ color: '#a5b4fc' }} />
    );
  };

  return (
    <Card
      sx={{
        border: '1px solid rgba(148,163,184,0.16)',
        background: 'rgba(15,23,42,0.72)',
        borderRadius: 2.5,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } } }}>
        {/* ── Header: title + actions ─────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}
            >
              Transactions
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#94a3b8', mt: 0.5 }}
            >
              Search, sort, filter, paginate, and export the table data.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <Tooltip title="Refresh">
              <IconButton
                onClick={loadTransactions}
                sx={{
                  color: '#e2e8f0',
                  border: '1px solid rgba(148,163,184,0.25)',
                  borderRadius: 2,
                  width: 40,
                  height: 40,
                  '&:hover': {
                    borderColor: 'rgba(148,163,184,0.5)',
                    bgcolor: 'rgba(148,163,184,0.08)',
                  },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => setExportOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
                py: 1,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 6px 18px rgba(99,102,241,0.45)',
                },
              }}
            >
              Export CSV
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'rgba(148,163,184,0.12)', mb: 3 }} />

        {/* ── Filters ─────────────────────────────────────── */}
        <FilterPanel
          filters={filters}
          searchInput={searchInput}
          filterOptions={filterOptions}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
          onSearchInputChange={setSearchInput}
          onClear={clearFilters}
        />

        {/* ── Active filter chip ──────────────────────────── */}
        {activeFilterCount > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2 }}>
            <Chip
              label={`${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}`}
              onDelete={clearFilters}
              deleteIcon={<Clear />}
              sx={{
                bgcolor: 'rgba(99,102,241,0.2)',
                color: '#c7d2fe',
                fontWeight: 600,
                border: '1px solid rgba(99,102,241,0.35)',
                '& .MuiChip-deleteIcon': { color: '#c7d2fe' },
              }}
            />
          </Stack>
        )}

        {/* ── Table ───────────────────────────────────────── */}
        <TableContainer
          component={Paper}
          sx={{
            background: 'transparent',
            border: '1px solid rgba(148,163,184,0.16)',
            borderRadius: 2,
            mt: activeFilterCount > 0 ? 0 : 2,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    color: '#94a3b8',
                    fontWeight: 700,
                    borderBottom: '1px solid rgba(148,163,184,0.16)',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    py: 1.5,
                  },
                }}
              >
                <TableCell>ID</TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => toggleSort('date')}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <span>Date</span>
                    {sortIndicator('date')}
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => toggleSort('amount')}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <span>Amount</span>
                    {sortIndicator('amount')}
                  </Stack>
                </TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 5, color: '#94a3b8' }}
                  >
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 5, color: '#94a3b8' }}
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow
                    key={t._id}
                    hover
                    sx={{
                      '& td': {
                        color: '#e2e8f0',
                        borderBottom: '1px solid rgba(148,163,184,0.08)',
                        py: 1.25,
                      },
                      '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{t.id}</TableCell>
                    <TableCell>
                      {new Date(t.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.category}
                        size="small"
                        sx={{
                          bgcolor:
                            t.category === 'Revenue'
                              ? 'rgba(34,197,94,0.15)'
                              : 'rgba(239,68,68,0.15)',
                          color:
                            t.category === 'Revenue' ? '#4ade80' : '#f87171',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.status}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: t.status === 'Paid' ? '#93c5fd' : '#fbbf24',
                          borderColor:
                            t.status === 'Paid'
                              ? 'rgba(147,197,253,0.4)'
                              : 'rgba(251,191,36,0.4)',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#cbd5e1' }}>
                      {t.user_id}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Pagination ──────────────────────────────────── */}
        <Box sx={{ mt: 2.5 }}>
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(total / pageSize))}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(nextSize) => {
              setPageSize(nextSize);
              setPage(1);
            }}
          />
        </Box>
      </CardContent>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        filters={filters}
      />
    </Card>
  );
}