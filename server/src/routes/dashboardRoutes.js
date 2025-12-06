import express from 'express';
import {
  getDashboardSummary,
  getActivity,
  getTopicBreakdown,
  getRecommendations
} from '../controllers/dashboardController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/dashboard/summary - Get user dashboard summary
router.get('/summary', getDashboardSummary);

// GET /api/dashboard/activity - Get user activity timeline
router.get('/activity', getActivity);

// GET /api/dashboard/topics - Get topic-wise performance breakdown
router.get('/topics', getTopicBreakdown);

// GET /api/dashboard/recommendations - Get learning recommendations
router.get('/recommendations', getRecommendations);

export default router;
