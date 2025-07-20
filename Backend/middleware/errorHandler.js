function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(err);

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
