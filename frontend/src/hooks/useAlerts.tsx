import { createContext, useContext, useState, ReactNode } from 'react';
import type { AlertColor } from '@mui/material';
import AlertChip from '../components/AlertChip';
import { Box, Snackbar } from '@mui/material';

interface AlertItem {
  id: number;
  message: string;
  severity: AlertColor;
}

interface AlertContextType {
  showAlert: (message: string, severity?: AlertColor) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = (message: string, severity: AlertColor = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, severity }]);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open
          autoHideDuration={4000}
          onClose={() => removeAlert(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ top: 16 + index * 72 }}
        >
          <Box>
            <AlertChip
              severity={alert.severity}
              message={alert.message}
              onClose={() => removeAlert(alert.id)}
            />
          </Box>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts must be used within AlertProvider');
  return ctx;
};