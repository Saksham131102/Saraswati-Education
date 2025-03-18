const express = require('express');
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitTestimonial,
  approveTestimonial,
  getPendingTestimonials
} = require('../controllers/testimonialController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Set isAdmin flag for admin users
router.use(async (req, res, next) => {
  if (req.admin) {
    req.isAdmin = true;
  } else {
    req.isAdmin = false;
  }
  next();
});

// Public route for user testimonial submissions
router.route('/submit').post(submitTestimonial);

// Admin-only routes
router.route('/pending')
  .get(protect, authorize('admin'), getPendingTestimonials);

router.route('/:id/approve')
  .put(protect, authorize('admin'), approveTestimonial);

// Regular routes
router
  .route('/')
  .get(getTestimonials)
  .post(protect, authorize('admin'), createTestimonial);

router
  .route('/:id')
  .get(getTestimonial)
  .put(protect, authorize('admin'), updateTestimonial)
  .delete(protect, authorize('admin'), deleteTestimonial);

module.exports = router; 