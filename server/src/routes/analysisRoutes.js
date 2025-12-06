import express from 'express';
import {
  analyzePerformance,
  getPerformanceTrends,
  getAnalysisSummary
} from '../controllers/analysisController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/analysis/performance - Analyze quiz performance
router.post('/performance', analyzePerformance);

// GET /api/analysis/trends - Get performance trends over time
router.get('/trends', getPerformanceTrends);

// GET /api/analysis/summary - Get strengths and weaknesses summary
router.get('/summary', getAnalysisSummary);

// GET /api/analysis/strengths-weaknesses - Alias for summary
router.get('/strengths-weaknesses', getAnalysisSummary);

export default router;
