// Global error handler — catches any error passed via next(err)
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Helper to create consistent errors
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};
export { errorHandler, createError };


// // Global error handler — catches any error passed via next(err)
// const errorHandler = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     ...(process.env.NODE_ENV === 'development' && {
//       stack: err.stack,
//     }),
//   });
// };

// // Helper to create consistent errors
// const createError = (message, statusCode) => {
//   const err = new Error(message);
//   err.statusCode = statusCode;
//   return err;
// };

// module.exports = { errorHandler, createError };