import LearningPath from '../models/LearningPath.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';

// @desc    Get user's learning path for a domain
// @route   GET /api/learning/path?domain=value
// @access  Private
export const getLearningPath = async (req, res, next) => {
  try {
    const { domain } = req.query;

    // Validate domain parameter
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Domain query parameter is required',
          status: 400
        }
      });
    }

    // Find user's learning path for the domain
    const learningPath = await LearningPath.findOne({
      userId: req.user.id,
      domain: domain.toLowerCase()
    })
      .populate({
        path: 'path.moduleId',
        select: 'title courseId order contentItems',
        populate: {
          path: 'courseId',
          select: 'title domain level'
        }
      });

    // If no learning path exists, return empty response
    if (!learningPath) {
      return res.status(200).json({
        success: true,
        data: {
          learningPath: null,
          message: 'No learning path found for this domain. Create one using /api/learning/path/rebuild'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        learningPath
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rebuild/create learning path for a domain
// @route   POST /api/learning/path/rebuild
// @access  Private
export const rebuildLearningPath = async (req, res, next) => {
  try {
    const { domain } = req.body;

    // Validate domain
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Domain is required',
          status: 400
        }
      });
    }

    // Find all courses in the domain
    const courses = await Course.find({ 
      domain: domain.toLowerCase() 
    })
      .populate({
        path: 'modules',
        select: 'title order',
        options: { sort: { order: 1 } }
      });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: `No courses found for domain: ${domain}`,
          status: 404
        }
      });
    }

    // TODO: AI integration will go here to intelligently select and order modules
    // For now, we'll use a simple strategy: include all modules from all courses
    
    // Collect all modules across all courses
    const allModules = [];
    
    courses.forEach(course => {
      if (course.modules && course.modules.length > 0) {
        course.modules.forEach(module => {
          allModules.push({
            moduleId: module._id,
            courseTitle: course.title,
            courseLevel: course.level,
            moduleOrder: module.order
          });
        });
      }
    });

    // Sort modules: beginner courses first, then intermediate, then advanced
    // Within each level, sort by course and module order
    const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    
    allModules.sort((a, b) => {
      const levelDiff = levelOrder[a.courseLevel] - levelOrder[b.courseLevel];
      if (levelDiff !== 0) return levelDiff;
      
      if (a.courseTitle !== b.courseTitle) {
        return a.courseTitle.localeCompare(b.courseTitle);
      }
      
      return a.moduleOrder - b.moduleOrder;
    });

    // Create path array with status
    const pathArray = allModules.map((item, index) => ({
      moduleId: item.moduleId,
      status: index === 0 ? 'not-started' : 'not-started', // First module could be 'in-progress' if desired
      startedAt: null,
      completedAt: null
    }));

    // Check if learning path already exists
    let learningPath = await LearningPath.findOne({
      userId: req.user.id,
      domain: domain.toLowerCase()
    });

    if (learningPath) {
      // Update existing learning path
      learningPath.path = pathArray;
      await learningPath.save();
    } else {
      // Create new learning path
      learningPath = await LearningPath.create({
        userId: req.user.id,
        domain: domain.toLowerCase(),
        path: pathArray
      });
    }

    // Populate the learning path before sending response
    await learningPath.populate({
      path: 'path.moduleId',
      select: 'title courseId order',
      populate: {
        path: 'courseId',
        select: 'title domain level'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        learningPath,
        message: `Learning path created/updated with ${pathArray.length} modules`,
        note: 'AI-powered personalization coming soon'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update module status in learning path
// @route   PATCH /api/learning/path/module/:moduleId
// @access  Private
export const updateModuleStatus = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { domain, status } = req.body;

    // Validate inputs
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Domain is required',
          status: 400
        }
      });
    }

    if (!status || !['not-started', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Valid status is required (not-started, in-progress, completed)',
          status: 400
        }
      });
    }

    // Validate ObjectId
    if (!moduleId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid module ID format',
          status: 400
        }
      });
    }

    // Find user's learning path
    const learningPath = await LearningPath.findOne({
      userId: req.user.id,
      domain: domain.toLowerCase()
    });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Learning path not found for this domain',
          status: 404
        }
      });
    }

    // Update module status using the model method
    await learningPath.updateModuleStatus(moduleId, status);

    // Populate before sending response
    await learningPath.populate({
      path: 'path.moduleId',
      select: 'title courseId order',
      populate: {
        path: 'courseId',
        select: 'title domain level'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        learningPath
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning path progress summary
// @route   GET /api/learning/path/progress?domain=value
// @access  Private
export const getProgress = async (req, res, next) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Domain query parameter is required',
          status: 400
        }
      });
    }

    const learningPath = await LearningPath.findOne({
      userId: req.user.id,
      domain: domain.toLowerCase()
    });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Learning path not found for this domain',
          status: 404
        }
      });
    }

    // Calculate progress statistics
    const total = learningPath.path.length;
    const completed = learningPath.path.filter(m => m.status === 'completed').length;
    const inProgress = learningPath.path.filter(m => m.status === 'in-progress').length;
    const notStarted = learningPath.path.filter(m => m.status === 'not-started').length;

    res.status(200).json({
      success: true,
      data: {
        domain: learningPath.domain,
        totalModules: total,
        completedModules: completed,
        inProgressModules: inProgress,
        notStartedModules: notStarted,
        progressPercentage: learningPath.progressPercentage,
        lastUpdated: learningPath.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
