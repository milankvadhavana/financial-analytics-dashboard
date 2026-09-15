import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import exportRoutes from './routes/exportRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/transactions', transactionRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
});

export default app;