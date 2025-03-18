const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
exports.getContacts = async (req, res) => {
  try {
    // Add filtering by status if provided
    let query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const contacts = await Contact.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid contact ID' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      status: 'New' // Set initial status to 'New'
    });
    
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private
exports.updateContactStatus = async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).json({ success: false, error: 'Please provide status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid contact ID' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid contact ID' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}; 