import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/auth.routes.js';
import warriorRoutes from './routes/warrior.routes.js';
import matchRoutes from './routes/match.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/warriors', warriorRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Warriors Game API is running 🎮' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

export default app;
