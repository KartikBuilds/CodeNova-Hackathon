import express from 'express';
import {
  chat,
  getChatHistory,
  startConversation,
  getSuggestedTopics,
  provideFeedback
} from '../controllers/tutorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Optional auth middleware - adds user info if token is present
const optionalAuth = (req, res, next) => {
  // Check if Authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // If auth header present, use authMiddleware
    return authMiddleware(req, res, next);
  }
  // Otherwise, continue without auth
  next();
};

// POST /api/tutor/chat - Chat with AI tutor (auth optional)
router.post('/chat', optionalAuth, chat);

// POST /api/tutor/conversation - Start a new conversation (auth optional)
router.post('/conversation', optionalAuth, startConversation);

// GET /api/tutor/topics - Get suggested topics (public)
router.get('/topics', getSuggestedTopics);

// POST /api/tutor/feedback - Provide feedback on tutor response (auth optional)
router.post('/feedback', optionalAuth, provideFeedback);

// GET /api/tutor/history - Get chat history (requires auth)
router.get('/history', authMiddleware, getChatHistory);

export default router;
