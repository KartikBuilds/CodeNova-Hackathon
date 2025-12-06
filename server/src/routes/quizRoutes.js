import express from 'express';
import {
  generateQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizSession,
  getQuizStats
} from '../controllers/quizController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/quiz/generate - Generate a quiz (public, auth optional)
router.post('/generate', generateQuiz);

// POST /api/quiz/submit - Submit quiz answers (requires auth)
router.post('/submit', authMiddleware, submitQuiz);

// GET /api/quiz/history - Get user's quiz history (requires auth)
router.get('/history', authMiddleware, getQuizHistory);

// GET /api/quiz/session/:id - Get single quiz session details (requires auth)
router.get('/session/:id', authMiddleware, getQuizSession);

// GET /api/quiz/stats - Get quiz statistics for user (requires auth)
router.get('/stats', authMiddleware, getQuizStats);

export default router;
