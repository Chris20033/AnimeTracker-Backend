const { ERROR_CODES } = require('../constants/errorCodes');
const userRepository = require('../repositories/user.repository');
const { AppError } = require('../utils/AppError');
const { asyncHandler } = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../utils/jwt');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required', 401, ERROR_CODES.AUTH_TOKEN_REQUIRED);
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    throw new AppError('Authentication token is required', 401, ERROR_CODES.AUTH_TOKEN_REQUIRED);
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401, ERROR_CODES.AUTH_TOKEN_INVALID);
  }

  const user = await userRepository.findUserById(payload.sub);

  if (!user || !user.isActive) {
    throw new AppError('Invalid or expired token', 401, ERROR_CODES.AUTH_TOKEN_INVALID);
  }

  req.user = user;
  return next();
});

module.exports = { authMiddleware };
