import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';
import learningPlanRoutes from './routes/learningPlanRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ===========================
// Root and Health Check Routes
// ===========================

// Root API endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CodeNova API is running successfully',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint (used by Railway and monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ===========================
// API Routes
// ===========================

app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/learning', learningPathRoutes);
app.use('/api/learning', learningPlanRoutes); // Merged with learning path routes
app.use('/api/learning/flashcards', flashcardRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ===========================
// Static File Serving (Frontend)
// ===========================

// Serve static files from the built frontend
const frontendDistPath = path.join(__dirname, '../../apps/client/frontend/dist');
app.use(express.static(frontendDistPath));

// SPA fallback: serve index.html for any non-API route that doesn't exist
// This allows React Router to handle client-side routing
app.get(/^(?!\/api\/).*/, (req, res, next) => {
  // Skip if it's an API route or a request for a static file
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html doesn't exist, let the 404 handler deal with it
      next();
    }
  });
});

// ===========================
// Error Handling
// ===========================

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
