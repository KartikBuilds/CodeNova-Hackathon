import aiService from '../services/aiService.js';
import UserProfile from '../models/UserProfile.js';
import LearningPlan from '../models/LearningPlan.js';

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
    const generatedPlan = await aiService.createLearningPlan(profileJson);

    // Save plan to database
    const savedPlan = new LearningPlan({
      userId: req.user.id,
      title: generatedPlan.title || `${topic} Learning Plan`,
      description: generatedPlan.description || `AI-generated learning plan for ${topic}`,
      domain: topic,
      duration: generatedPlan.duration || `${days} days`,
      goals: goals,
      plan: generatedPlan,
      metadata: {
        difficulty,
        estimatedHours: days * (hoursPerDay || 2),
        strengths,
        weaknesses,
        hoursPerDay
      },
      progress: {
        totalDays: generatedPlan.days || days,
        completedDays: [],
        progressPercentage: 0
      }
    });

    await savedPlan.save();

    res.status(201).json({
      success: true,
      data: {
        learningPlan: savedPlan,
        message: 'Learning plan generated and saved successfully'
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

    // Build query
    const query = { userId: req.user.id, isActive: true };
    if (topic) {
      query.domain = new RegExp(topic, 'i');
    }

    // Fetch saved learning plans from database
    const plans = await LearningPlan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await LearningPlan.countDocuments(query);

    res.status(200).json({
      success: true,
      data: plans,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: plans.length,
        totalRecords: total
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

    // Find and update the learning plan
    const plan = await LearningPlan.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Learning plan not found',
          status: 404
        }
      });
    }

    // Update progress
    if (completed) {
      await plan.updateProgress(day);
    } else {
      // Remove day from completed if unchecking
      plan.progress.completedDays = plan.progress.completedDays.filter(d => d !== day);
      plan.progress.progressPercentage = Math.round(
        (plan.progress.completedDays.length / plan.progress.totalDays) * 100
      );
      plan.progress.lastUpdated = new Date();
      await plan.save();
    }

    res.status(200).json({
      success: true,
      data: {
        plan,
        message: 'Learning plan progress updated successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};
