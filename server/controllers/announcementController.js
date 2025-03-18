const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res) => {
  try {
    // Add filtering by category if provided
    let query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    const announcements = await Announcement.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid announcement ID' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid announcement ID' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid announcement ID' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}; 