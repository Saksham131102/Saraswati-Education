const express = require('express');
const router = express.Router();
const { 
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

// Routes for /api/courses
router.route('/')
  .get(getCourses)
  .post(protect, createCourse);

// Routes for /api/courses/:id
router.route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router; 