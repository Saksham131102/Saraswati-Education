const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');

// @desc    Get all team members with optional filtering
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  const filter = { isActive: true };
  if (type) {
    filter.type = type;
  }
  
  const teams = await Team.find(filter).sort('order');
  
  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Get all team members for admin (including inactive)
// @route   GET /api/team/admin
// @access  Private/Admin
exports.getAllTeamMembersAdmin = asyncHandler(async (req, res) => {
  const teams = await Team.find().sort('type order');
  
  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  
  if (!team) {
    res.status(404);
    throw new Error('Team member not found');
  }
  
  res.status(200).json({
    success: true,
    data: team
  });
});

// @desc    Create new team member
// @route   POST /api/team
// @access  Private/Admin
exports.createTeamMember = asyncHandler(async (req, res) => {
  try {
    console.log('Creating team member with data:', req.body);
    
    const teamData = {
      ...req.body,
      // Ensure arrays are properly formatted, default to empty arrays if missing
      qualifications: Array.isArray(req.body.qualifications) ? req.body.qualifications : [],
      areasOfInterest: Array.isArray(req.body.areasOfInterest) ? req.body.areasOfInterest : []
    };
    
    // Create the team member
    const team = await Team.create(teamData);
    
    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
        details: error.message
      });
    }
  }
});

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
exports.updateTeamMember = asyncHandler(async (req, res) => {
  try {
    let team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }
    
    // Update the timestamp
    const teamData = {
      ...req.body,
      updatedAt: Date.now(),
      // Ensure arrays are properly formatted, default to empty arrays if missing
      qualifications: Array.isArray(req.body.qualifications) ? req.body.qualifications : [],
      areasOfInterest: Array.isArray(req.body.areasOfInterest) ? req.body.areasOfInterest : []
    };
    
    team = await Team.findByIdAndUpdate(req.params.id, teamData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
        details: error.message
      });
    }
  }
});

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
exports.deleteTeamMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  
  if (!team) {
    res.status(404);
    throw new Error('Team member not found');
  }
  
  await team.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
}); 