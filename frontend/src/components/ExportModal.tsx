import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Divider,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { Download, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { transactionService } from '../services/transactionService';
import { useAlerts } from '../hooks/useAlerts';

interface Props {
  open: boolean;
  onClose: () => void;
  filters: any;
}

const AVAILABLE_COLUMNS = [
  { key: 'id', label: 'Transaction ID', default: true },
  { key: 'date', label: 'Date', default: true },
  { key: 'amount', label: 'Amount', default: true },
  { key: 'category', label: 'Category', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'user_id', label: 'User ID', default: false },
  { key: 'user_profile', label: 'Profile URL', default: false },
];

export default function ExportModal({ open, onClose, filters }: Props) {
  const { showAlert } = useAlerts();
  const [selected, setSelected] = useState<string[]>(
    AVAILABLE_COLUMNS.filter((c) => c.default).map((c) => c.key)
  );
  const [exporting, setExporting] = useState(false);

  const toggleColumn = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectAll = () => setSelected(AVAILABLE_COLUMNS.map((c) => c.key));
  const clearAll = () => setSelected([]);

  // ✅ Only count real filters (ignore sortBy / sortOrder / pagination)
  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;
    return Boolean(
      filters.search ||
        filters.category ||
        filters.status ||
        filters.user_id ||
        filters.startDate ||
        filters.endDate ||
        filters.minAmount !== undefined ||
        filters.maxAmount !== undefined
    );
  }, [filters]);

  // Count of active filters shown as a chip
  const activeFilterCount = useMemo(() => {
    if (!filters) return 0;
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

  const handleExport = async () => {
    if (selected.length === 0) {
      showAlert('Please select at least one column', 'warning');
      return;
    }

    setExporting(true);
    try {
      await transactionService.exportCSV(selected, filters);
      showAlert('CSV downloaded successfully', 'success');
      onClose();
    } catch (error: any) {
      showAlert(error.response?.data?.error || 'Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  const allSelected = selected.length === AVAILABLE_COLUMNS.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: '1px solid rgba(148,163,184,0.2)',
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.98) 100%)',
          color: '#e2e8f0',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          color: 'white',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.02em',
          pb: 1,
        }}
      >
        Export Transactions to CSV
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(148,163,184,0.95)', mb: 2 }}
        >
          Select the columns you want to include in your export. Your current
          filters will be applied automatically.
        </Typography>

        <Divider sx={{ borderColor: 'rgba(148,163,184,0.12)', mb: 2 }} />

        {/* ── Header: title + select/clear buttons ─────────── */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1.5}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: '#cbd5e1',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: 12,
            }}
          >
            Available Columns
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={selectAll}
              disabled={allSelected}
              startIcon={<CheckCircle fontSize="small" />}
              sx={{
                textTransform: 'none',
                color: '#e2e8f0',
                borderColor: 'rgba(148,163,184,0.35)',
                fontSize: 12,
                py: 0.5,
                '&:hover': {
                  borderColor: 'rgba(148,163,184,0.6)',
                  bgcolor: 'rgba(148,163,184,0.08)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(148,163,184,0.4)',
                  borderColor: 'rgba(148,163,184,0.15)',
                },
              }}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={clearAll}
              disabled={selected.length === 0}
              startIcon={<RadioButtonUnchecked fontSize="small" />}
              sx={{
                textTransform: 'none',
                color: '#e2e8f0',
                borderColor: 'rgba(148,163,184,0.35)',
                fontSize: 12,
                py: 0.5,
                '&:hover': {
                  borderColor: 'rgba(148,163,184,0.6)',
                  bgcolor: 'rgba(148,163,184,0.08)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(148,163,184,0.4)',
                  borderColor: 'rgba(148,163,184,0.15)',
                },
              }}
            >
              Clear All
            </Button>
          </Stack>
        </Stack>

        {/* ── Column checkboxes ──────────────────────────── */}
        <Box
          sx={{
            border: '1px solid rgba(148,163,184,0.16)',
            borderRadius: 2,
            bgcolor: 'rgba(2,6,23,0.4)',
            p: 1,
          }}
        >
          <FormGroup>
            {AVAILABLE_COLUMNS.map((col) => {
              const checked = selected.includes(col.key);
              return (
                <FormControlLabel
                  key={col.key}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      size="small"
                      sx={{
                        color: 'rgba(148,163,184,0.6)',
                        '&.Mui-checked': { color: '#818cf8' },
                        '&:hover': { bgcolor: 'rgba(129,140,248,0.08)' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: checked ? '#e2e8f0' : 'rgba(148,163,184,0.85)',
                          fontWeight: checked ? 600 : 500,
                        }}
                      >
                        {col.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(100,116,139,0.8)',
                          fontFamily: 'monospace',
                          fontSize: 11,
                        }}
                      >
                        {col.key}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1.5,
                    width: '100%',
                    '&:hover': { bgcolor: 'rgba(129,140,248,0.06)' },
                  }}
                />
              );
            })}
          </FormGroup>
        </Box>

        {/* ── Selected count chip ───────────────────────── */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${selected.length} of ${AVAILABLE_COLUMNS.length} selected`}
            size="small"
            sx={{
              bgcolor: 'rgba(99,102,241,0.15)',
              color: '#c7d2fe',
              fontWeight: 600,
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          />
        </Box>

        {/* ── Active filters alert (only if truly active) ── */}
        {hasActiveFilters && (
          <Alert
            severity="info"
            icon={false}
            sx={{
              mt: 2,
              bgcolor: 'rgba(59,130,246,0.1)',
              color: '#93c5fd',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: 13 },
            }}
          >
            <strong>{activeFilterCount}</strong> active filter
            {activeFilterCount > 1 ? 's' : ''} will be applied to the export.
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          borderTop: '1px solid rgba(148,163,184,0.12)',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#cbd5e1',
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(148,163,184,0.08)' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={exporting || selected.length === 0}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 6px 18px rgba(99,102,241,0.45)',
            },
            '&.Mui-disabled': {
              background: 'rgba(99,102,241,0.25)',
              color: 'rgba(226,232,240,0.5)',
            },
          }}
        >
          {exporting ? 'Exporting...' : 'Download CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}