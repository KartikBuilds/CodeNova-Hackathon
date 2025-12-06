import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';
import learningPlanRoutes from './routes/learningPlanRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('CORS configuration:', {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/learning', learningPathRoutes);
app.use('/api/learning', learningPlanRoutes); // Merged with learning path routes
app.use('/api/quiz', quizRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      status: statusCode,
      message: message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      status: statusCode,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

export default app;
