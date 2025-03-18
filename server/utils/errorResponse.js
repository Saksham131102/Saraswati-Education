class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    // Maintain proper stack trace for debugging (available on Error object)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse; 