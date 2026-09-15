import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: Array<{ month: string; revenue: number; expenses: number }>;
  loading?: boolean;
}

export default function RevenueExpenseChart({ data, loading }: Props) {
  return (
    <Card sx={{ height: '100%', border: '1px solid rgba(148,163,184,0.16)', background: 'rgba(15,23,42,0.72)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Revenue vs Expenses
        </Typography>
        <Box sx={{ width: '100%', height: 320 }}>
          {loading ? (
            <Box sx={{ color: '#94a3b8', display: 'grid', placeItems: 'center', height: '100%' }}>
              Loading chart...
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
