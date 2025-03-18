const express = require('express');
const router = express.Router();
const { 
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect } = require('../middleware/auth');

// Routes for /api/announcements
router.route('/')
  .get(getAnnouncements)
  .post(protect, createAnnouncement);

// Routes for /api/announcements/:id
router.route('/:id')
  .get(getAnnouncement)
  .put(protect, updateAnnouncement)
  .delete(protect, deleteAnnouncement);

module.exports = router; 