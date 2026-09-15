import { AppBar, Avatar, Box, Button, Toolbar, Typography, Chip } from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';
import type { User } from '../types';

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: Props) {
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        color: 'white',
      }}
    >
      <Toolbar
        sx={{
          gap: 2,
          maxWidth: 1600,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                fontSize: { xs: 16, sm: 18 },
              }}
            >
              Financial Analytics
            </Typography>
            
          </Box>
        </Box>
        {/* User info */}
        <Chip
          icon={<AccountCircle sx={{ color: 'rgba(255,255,255,0.85) !important' }} />}
          label={user?.role ? user.role.toUpperCase() : 'MEMBER'}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            bgcolor: 'rgba(99, 102, 241, 0.2)',
            color: '#c7d2fe',
            fontWeight: 700,
            letterSpacing: 0.5,
            border: '1px solid rgba(99,102,241,0.35)',
          }}
        />

        <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.9)' }}>
            {user?.email || ''}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontWeight: 800,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {initials}
        </Avatar>

        <Button
          color="inherit"
          startIcon={<Logout />}
          onClick={onLogout}
          sx={{
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            px: 2,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}