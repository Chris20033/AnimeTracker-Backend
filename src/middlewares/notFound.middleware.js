const { AppError } = require('../utils/AppError');
const { ERROR_CODES } = require('../constants/errorCodes');

function notFoundMiddleware(req, res, next) {
  next(new AppError('Route not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND));
}

module.exports = { notFoundMiddleware };
