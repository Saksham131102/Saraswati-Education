const express = require('express');
const router = express.Router();
const { 
  login,
  getMe,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Private routes (require authentication)
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router; 