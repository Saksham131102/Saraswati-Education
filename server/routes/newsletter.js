const express = require('express');
const router = express.Router();
const { 
  subscribe, 
  unsubscribe,
  getSubscriptions,
  deleteSubscription
} = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.put('/unsubscribe', unsubscribe);

// Protected routes (admin only)
router.get('/subscriptions', protect, getSubscriptions);
router.delete('/subscription/:id', protect, deleteSubscription);

module.exports = router; 