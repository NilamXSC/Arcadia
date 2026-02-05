const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
};

const notFound = (req, res) => {
  res.status(404).json({ error: `Not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
