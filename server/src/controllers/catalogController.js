import Course from '../models/Course.js';
import Module from '../models/Module.js';
import ContentItem from '../models/ContentItem.js';

// @desc    Get unique list of domains
// @route   GET /api/catalog/domains
// @access  Public
export const getDomains = async (req, res, next) => {
  try {
    // Get distinct domains from Course collection
    const domains = await Course.distinct('domain');

    res.status(200).json({
      success: true,
      count: domains.length,
      data: {
        domains: domains.sort()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses (optional filter by domain)
// @route   GET /api/catalog/courses?domain=value
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { domain, level, search, page = 1, limit = 10 } = req.query;

    // Build query filter
    const filter = {};

    if (domain) {
      // Case-insensitive domain search
      filter.domain = { $regex: new RegExp(`^${domain}$`, 'i') };
    }

    if (level) {
      // Case-insensitive level search
      filter.level = { $regex: new RegExp(`^${level}$`, 'i') };
    }

    // Text search if search parameter provided
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const courses = await Course.find(filter)
      .select('title domain description level modules createdAt')
      .populate({
        path: 'modules',
        select: 'title order'
      })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: {
        courses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course with populated modules
// @route   GET /api/catalog/course/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid course ID format',
          status: 400
        }
      });
    }

    // Find course and populate modules
    const course = await Course.findById(id)
      .populate({
        path: 'modules',
        select: 'title order contentItems',
        options: { sort: { order: 1 } }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Course not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        course
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get module with populated content items
// @route   GET /api/catalog/module/:id
// @access  Public
export const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid module ID format',
          status: 400
        }
      });
    }

    // Find module and populate content items and course info
    const module = await Module.findById(id)
      .populate({
        path: 'contentItems',
        select: 'type provider title url duration tags'
      })
      .populate({
        path: 'courseId',
        select: 'title domain level'
      });

    if (!module) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Module not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        module
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course modules
// @route   GET /api/catalog/course/:id/modules
// @access  Public
export const getCourseModules = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid course ID format',
          status: 400
        }
      });
    }

    // Find modules for the course
    const modules = await Module.find({ courseId: id })
      .select('title order contentItems')
      .populate({
        path: 'contentItems',
        select: 'type title duration'
      })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: {
        modules
      }
    });
  } catch (error) {
    next(error);
  }
};
