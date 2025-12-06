import aiService from '../services/aiService.js';
import UserProfile from '../models/UserProfile.js';

// @desc    Create personalized learning plan using AI
// @route   POST /api/learning/plan
// @access  Private
export const createPlan = async (req, res, next) => {
  try {
    const { topic, strengths = [], weaknesses = [], difficulty, goals = [], days = 7, hoursPerDay } = req.body;

    // Validate required fields
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Topic is required',
          status: 400
        }
      });
    }

    // Validate arrays
    if (strengths && !Array.isArray(strengths)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Strengths must be an array',
          status: 400
        }
      });
    }

    if (weaknesses && !Array.isArray(weaknesses)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Weaknesses must be an array',
          status: 400
        }
      });
    }

    if (goals && !Array.isArray(goals)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Goals must be an array',
          status: 400
        }
      });
    }

    // Validate days
    if (days && (days < 1 || days > 30)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Days must be between 1 and 30',
          status: 400
        }
      });
    }

    // Get user profile for additional context (optional)
    let userProfile = null;
    try {
      userProfile = await UserProfile.findOne({ userId: req.user.id });
    } catch (error) {
      // Continue without profile if not found
      console.log('User profile not found, continuing without it');
    }

    // Prepare profile data for AI
    const profileJson = {
      domain: topic,
      currentLevel: difficulty || 'medium',
      strengths,
      weaknesses,
      goals,
      days: parseInt(days),
      studyTimePerDay: hoursPerDay ? parseFloat(hoursPerDay) * 60 : (userProfile?.preferences?.studyTimePerDay || 30),
      learningStyle: userProfile?.preferences?.learningStyle || 'visual'
    };

    // Call AI service to create learning plan
    const plan = await aiService.createLearningPlan(profileJson);

    res.status(200).json({
      success: true,
      data: {
        plan,
        userId: req.user.id,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved learning plans for user
// @route   GET /api/learning/plans
// @access  Private
export const getSavedPlans = async (req, res, next) => {
  try {
    const { topic, page = 1, limit = 10 } = req.query;

    // This would fetch saved learning plans from a database
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        message: 'Saved learning plans coming soon',
        topic,
        note: 'Will store and retrieve AI-generated learning plans'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update learning plan progress
// @route   PATCH /api/learning/plan/:id/progress
// @access  Private
export const updatePlanProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { day, completed } = req.body;

    // Validate inputs
    if (!day || typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Day number and completed status are required',
          status: 400
        }
      });
    }

    // This would update progress in a saved learning plan
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        message: 'Learning plan progress update coming soon',
        planId: id,
        day,
        completed,
        note: 'Will track completion of daily tasks in learning plans'
      }
    });
  } catch (error) {
    next(error);
  }
};
