import { Card, CardContent, Typography, Box } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#60a5fa', '#22c55e', '#f97316', '#eab308', '#a855f7'];

interface Props {
  data: Array<{ category: string; amount: number; total?: number }>; 
  loading?: boolean;
}

export default function CategoryChart({ data, loading }: Props) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.amount ?? item.total ?? 0,
  }));

  return (
    <Card sx={{ height: '100%', border: '1px solid rgba(148,163,184,0.16)', background: 'rgba(15,23,42,0.72)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Category Breakdown
        </Typography>
        <Box sx={{ width: '100%', height: 320 }}>
          {loading ? (
            <Box sx={{ color: '#94a3b8', display: 'grid', placeItems: 'center', height: '100%' }}>
              Loading chart...
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={110} label>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
