import { Chip } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';

const ICONS: Record<AlertColor, JSX.Element> = {
  success: <CheckCircle fontSize="small" />,
  error: <Error fontSize="small" />,
  warning: <Warning fontSize="small" />,
  info: <Info fontSize="small" />,
};

interface Props {
  severity: AlertColor;
  message: string;
  onClose?: () => void;
}

export default function AlertChip({ severity, message, onClose }: Props) {
  return (
    <Chip
      icon={ICONS[severity]}
      label={message}
      onDelete={onClose}
      color={severity}
      variant="filled"
      sx={{
        fontWeight: 600,
        boxShadow: '0 10px 30px rgba(0,0,0,0.14)',
        '& .MuiChip-icon': { color: 'inherit' },
      }}
    />
  );
}
