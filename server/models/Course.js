const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  class: {
    type: Number,
    required: [true, 'Please add a class level'],
    min: [1, 'Class level must be at least 1'],
    max: [12, 'Class level cannot exceed 12']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration'],
    trim: true
  },
  schedule: {
    type: String,
    required: [true, 'Please add a schedule'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL'],
    trim: true
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

module.exports = mongoose.model('Course', CourseSchema); 