const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL'],
    trim: true
  },
  qualifications: {
    type: [String],
    default: []
  },
  areasOfInterest: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['team', 'developer'],
    default: 'team'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  skills: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema); 