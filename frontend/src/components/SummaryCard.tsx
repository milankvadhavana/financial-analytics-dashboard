import { Card, CardContent, Stack, Typography } from '@mui/material';

interface Props {
  title: string;
  value: string;
  helper?: string;
  tone?: 'neutral' | 'success' | 'error' | 'primary';
}

const TONES: Record<NonNullable<Props['tone']>, string> = {
  neutral: '#e2e8f0',
  success: '#22c55e',
  error: '#ef4444',
  primary: '#60a5fa',
};

export default function SummaryCard({ title, value, helper, tone = 'neutral' }: Props) {
  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid rgba(148,163,184,0.16)',
        background: 'linear-gradient(180deg, rgba(15,23,42,0.9), rgba(15,23,42,0.65))',
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: TONES[tone] }}>
            {value}
          </Typography>
          {helper ? (
            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
              {helper}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
