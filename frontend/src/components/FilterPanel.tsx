import {
  Button,
  Card,
  CardContent,
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Search, RestartAlt } from '@mui/icons-material';
import type { TransactionFilters } from '../types';

interface Props {
  filters: TransactionFilters;
  searchInput: string;
  filterOptions: {
    categories: string[];
    statuses: string[];
    users: string[];
  };
  onChange: (next: TransactionFilters) => void;
  onSearchInputChange: (value: string) => void;
  onClear: () => void;
}

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'rgba(2,6,23,0.55)',
    color: '#e2e8f0',
    fontSize: 14,
    '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(148,163,184,0.45)' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(148,163,184,0.9)', fontSize: 13 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#a5b4fc' },
  '& .MuiSvgIcon-root': { color: 'rgba(148,163,184,0.9)' },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    filter: 'invert(0.7)',
    cursor: 'pointer',
  },
} as const;

export default function FilterPanel({
  filters,
  searchInput,
  filterOptions,
  onChange,
  onSearchInputChange,
  onClear,
}: Props) {
  const update = (patch: Partial<TransactionFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <Card
      sx={{
        border: '1px solid rgba(148,163,184,0.16)',
        background: 'rgba(15,23,42,0.72)',
        mb: 2,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* ── Header row ─────────────────────────────────── */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}
            >
              Filters
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(148,163,184,0.9)' }}
            >
              Search, filter by date, amount, category, status, or user
            </Typography>
          </Box>

          <Button
  size="small"
  disableRipple
  startIcon={<RestartAlt sx={{ fontSize: 15 }} />}
  onClick={onClear}
  sx={{
    minWidth: 0,
    minHeight: 0,
    textTransform: 'none',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    color: 'rgba(148,163,184,0.9)',
    padding: '0px 10px',
    borderRadius: 1.5,
    '& .MuiButton-startIcon': {
      marginRight: '4px',
      marginLeft: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '&:hover': {
      bgcolor: 'rgba(148,163,184,0.12)',
      color: '#e2e8f0',
    },
  }}
>
  Reset
</Button>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(148,163,184,0.12)', mb: 2 }} />

        {/* ── Row 1: Search (span 6) + From (span 3) + To (span 3) ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search user, category, status, amount..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              sx={FIELD_SX}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date From"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.startDate ?? ''}
              onChange={(e) => update({ startDate: e.target.value })}
              sx={FIELD_SX}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 3' } }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date To"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.endDate ?? ''}
              onChange={(e) => update({ endDate: e.target.value })}
              sx={FIELD_SX}
            />
          </Box>
        </Box>

        {/* ── Row 2: Min (3) + Max (3) + Category (2) + Status (2) + User (2) ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 2,
          }}
        >
          <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
            <TextField
              fullWidth
              size="small"
              label="Min Amount"
              type="number"
              value={filters.minAmount ?? ''}
              onChange={(e) =>
                update({
                  minAmount:
                    e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
              sx={FIELD_SX}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
            <TextField
              fullWidth
              size="small"
              label="Max Amount"
              type="number"
              value={filters.maxAmount ?? ''}
              onChange={(e) =>
                update({
                  maxAmount:
                    e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
              sx={FIELD_SX}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 4', md: 'span 2' } }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Category"
              value={filters.category ?? ''}
              onChange={(e) => update({ category: e.target.value })}
              sx={FIELD_SX}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 4', md: 'span 2' } }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Status"
              value={filters.status ?? ''}
              onChange={(e) => update({ status: e.target.value })}
              sx={FIELD_SX}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 4', md: 'span 2' } }}>
            <TextField
              fullWidth
              size="small"
              select
              label="User"
              value={filters.user_id ?? ''}
              onChange={(e) => update({ user_id: e.target.value })}
              sx={FIELD_SX}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.users.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}