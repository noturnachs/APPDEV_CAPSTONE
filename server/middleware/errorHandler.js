// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.message) {
    // Use custom error message if provided
    message = err.message;
    
    // Set appropriate status codes based on error message
    if (err.message.includes('not found')) {
      statusCode = 404;
    } else if (err.message.includes('required') || err.message.includes('Invalid')) {
      statusCode = 400;
    } else if (err.message.includes('unauthorized') || err.message.includes('deactivated')) {
      statusCode = 401;
    } else if (err.message.includes('forbidden')) {
      statusCode = 403;
    }
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 