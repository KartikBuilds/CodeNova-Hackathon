import express from 'express';
import {
  getLearningPath,
  rebuildLearningPath,
  updateModuleStatus,
  getProgress
} from '../controllers/learningPathController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/learning/path?domain=value - Get user's learning path for a domain
router.get('/path', getLearningPath);

// POST /api/learning/path/rebuild - Rebuild/create learning path for a domain
router.post('/path/rebuild', rebuildLearningPath);

// PATCH /api/learning/path/module/:moduleId - Update module status in learning path
router.patch('/path/module/:moduleId', updateModuleStatus);

// GET /api/learning/path/progress?domain=value - Get learning path progress summary
router.get('/path/progress', getProgress);

export default router;
