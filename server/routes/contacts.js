const express = require('express');
const router = express.Router();
const { 
  getContacts,
  getContact,
  createContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Routes for /api/contacts
router.route('/')
  .get(protect, getContacts)
  .post(createContact);

// Routes for /api/contacts/:id
router.route('/:id')
  .get(protect, getContact)
  .put(protect, updateContactStatus)
  .delete(protect, deleteContact);

module.exports = router; 