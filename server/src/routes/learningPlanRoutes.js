import express from 'express';
import {
  createPlan,
  getSavedPlans,
  updatePlanProgress
} from '../controllers/learningPlanController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/learning/plan - Create personalized learning plan
router.post('/plan', createPlan);

// GET /api/learning/plans - Get saved learning plans
router.get('/plans', getSavedPlans);

// PATCH /api/learning/plan/:id/progress - Update learning plan progress
router.patch('/plan/:id/progress', updatePlanProgress);

export default router;
