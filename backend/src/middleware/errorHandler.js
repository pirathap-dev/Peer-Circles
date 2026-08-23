// Generic error handler. Must be registered last.
function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

module.exports = errorHandler;
