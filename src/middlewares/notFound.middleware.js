const { AppError } = require('../utils/AppError');

function notFoundMiddleware(req, res, next) {
  next(new AppError('Route not found', 404, 'RESOURCE_NOT_FOUND'));
}

module.exports = { notFoundMiddleware };
