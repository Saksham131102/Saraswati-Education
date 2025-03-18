const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  let query;
  
  // Copy req.query
  const reqQuery = { ...req.query };
  
  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  
  // By default, only return approved testimonials for public view
  if (!req.isAdmin) {
    reqQuery.isApproved = true;
  }
  
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  // Finding resource
  query = Testimonial.find(JSON.parse(queryStr));
  
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-rating -createdAt'); // Default sort by rating (high to low) and then by most recent
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Testimonial.countDocuments(JSON.parse(queryStr));
  
  query = query.skip(startIndex).limit(limit);
  
  // Executing query
  const testimonials = await query;
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: testimonials.length,
    pagination,
    data: testimonials
  });
});

// @desc    Get pending testimonials (waiting for approval)
// @route   GET /api/testimonials/pending
// @access  Private (Admin only)
exports.getPendingTestimonials = asyncHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find({ isApproved: false }).sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    return next(
      new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404)
    );
  }
  
  // If not admin and testimonial is not approved, return error
  if (!req.isAdmin && !testimonial.isApproved) {
    return next(
      new ErrorResponse('Testimonial not available', 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Submit testimonial for approval (public)
// @route   POST /api/testimonials/submit
// @access  Public
exports.submitTestimonial = asyncHandler(async (req, res, next) => {
  // Set defaults for public submissions
  const testimonialData = {
    ...req.body,
    isApproved: false,
    isActive: true
  };
  
  const testimonial = await Testimonial.create(testimonialData);
  
  res.status(201).json({
    success: true,
    message: 'Thank you for your testimonial! It will be visible after review.',
    data: testimonial
  });
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.create(req.body);
  
  res.status(201).json({
    success: true,
    data: testimonial
  });
});

// @desc    Approve testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private (Admin only)
exports.approveTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    return next(
      new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404)
    );
  }
  
  testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id, 
    { isApproved: true }, 
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    return next(
      new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404)
    );
  }
  
  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    return next(
      new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404)
    );
  }
  
  await testimonial.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
}); 