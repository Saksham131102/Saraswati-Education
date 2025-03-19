const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      sort = '-createdAt',
      featured,
      category,
      isActive 
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by featured status
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      // By default, show only active videos for public requests
      query.isActive = true;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const videos = await Video.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Video.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: videos.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: videos
    });
  } catch (error) {
    console.error('Error getting videos:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error getting video:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Create new video
// @route   POST /api/videos
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const video = await Video.create(req.body);
    
    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error creating video:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error updating video:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    await video.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router; 