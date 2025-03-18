const express = require('express');
const { 
  getTeamMembers, 
  getTeamMember, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember,
  getAllTeamMembersAdmin
} = require('../controllers/teamController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected admin routes - these need to come first for proper routing!
router.route('/admin')
  .get(protect, authorize('admin'), getAllTeamMembersAdmin);

// Public and protected routes
router.route('/')
  .get(getTeamMembers)
  .post(protect, authorize('admin'), createTeamMember);

router.route('/:id')
  .get(getTeamMember)
  .put(protect, authorize('admin'), updateTeamMember)
  .delete(protect, authorize('admin'), deleteTeamMember);

module.exports = router; 