import express from 'express';
import {
  getDomains,
  getCourses,
  getCourseById,
  getModuleById,
  getCourseModules
} from '../controllers/catalogController.js';

const router = express.Router();

// GET /api/catalog/domains - Get unique list of domains
router.get('/domains', getDomains);

// GET /api/catalog/courses - Get all courses (optional query: domain, level, search, page, limit)
router.get('/courses', getCourses);

// GET /api/catalog/course/:id - Get single course with populated modules
router.get('/course/:id', getCourseById);

// GET /api/catalog/course/:id/modules - Get all modules for a course
router.get('/course/:id/modules', getCourseModules);

// GET /api/catalog/module/:id - Get module with populated content items
router.get('/module/:id', getModuleById);

export default router;
