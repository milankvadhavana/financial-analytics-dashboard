import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Container, Stack, Paper
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useAlerts } from '../hooks/useAlerts';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showAlert } = useAlerts();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showAlert('Login successful', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      showAlert(
        error.response?.data?.error || 'Login failed',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background: 'radial-gradient(circle at top left, rgba(96,165,250,0.16), transparent 30%), linear-gradient(135deg, #020617, #0f172a 60%, #111827)',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ border: '1px solid rgba(148,163,184,0.16)', background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(20px)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: '0.3em', color: '#94a3b8' }}>
                  Financial App
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', mt: 0.5 }}>
                  Sign in to continue
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                  Access the analytics dashboard, transaction explorer, and CSV export tools.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.4, fontWeight: 800 }}
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </Button>
                </Stack>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(148,163,184,0.16)' }}>
                <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                  Demo credentials: demo@example.com / password123
                </Typography>
              </Paper>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}