import { Box, Pagination as MuiPagination, MenuItem, Select, Stack, Typography } from '@mui/material';

interface Props {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Rows per page
        </Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          sx={{
            color: '#e2e8f0',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148,163,184,0.3)' },
            '& .MuiSvgIcon-root': { color: '#94a3b8' },
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          {total} total
        </Typography>
      </Stack>

      <MuiPagination
        page={page}
        count={totalPages}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#e2e8f0',
            borderColor: 'rgba(148,163,184,0.3)',
          },
          '& .Mui-selected': {
            bgcolor: 'rgba(99,102,241,0.3) !important',
            color: 'white !important',
          },
        }}
      />
    </Box>
  );
}