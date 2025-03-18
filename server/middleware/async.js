/**
 * Async handler middleware to remove try-catch blocks in controller functions
 * @param {Function} fn - The controller function to be wrapped
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 