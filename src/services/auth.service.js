const { ERROR_CODES } = require('../constants/errorCodes');
const passwordResetTokenRepository = require('../repositories/passwordResetToken.repository');
const userRepository = require('../repositories/user.repository');
const { sendPasswordResetEmail } = require('./mail.service');
const { AppError } = require('../utils/AppError');
const { signAccessToken } = require('../utils/jwt');
const { comparePassword, hashPassword } = require('../utils/password');
const { generateSecureToken, hashToken } = require('../utils/token');

const PASSWORD_RESET_TOKEN_TTL_MINUTES = 30;
const PASSWORD_RESET_PUBLIC_MESSAGE = 'If the email exists, a recovery link will be sent';

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
  };
}

async function register(input) {
  const usernameExists = await userRepository.findUserByUsername(input.username);

  if (usernameExists) {
    throw new AppError('Username already exists', 409, ERROR_CODES.USERNAME_ALREADY_EXISTS);
  }

  const emailExists = await userRepository.findUserByEmail(input.email);

  if (emailExists) {
    throw new AppError('Email already exists', 409, ERROR_CODES.EMAIL_ALREADY_EXISTS);
  }

  const user = await userRepository.createUser({
    username: input.username,
    email: input.email,
    passwordHash: await hashPassword(input.password),
  });

  return {
    user: serializeUser(user),
    accessToken: signAccessToken(user),
  };
}

async function login(input) {
  const user = await userRepository.findUserByEmail(input.email);

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid credentials', 401, ERROR_CODES.AUTH_INVALID_CREDENTIALS);
  }

  const isValidPassword = await comparePassword(input.password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401, ERROR_CODES.AUTH_INVALID_CREDENTIALS);
  }

  if (!user.isActive) {
    throw new AppError('Forbidden', 403, ERROR_CODES.FORBIDDEN);
  }

  return {
    user: serializeUser(user),
    accessToken: signAccessToken(user),
  };
}

async function forgotPassword(input) {
  const user = await userRepository.findUserByEmail(input.email);

  if (!user) {
    return { message: PASSWORD_RESET_PUBLIC_MESSAGE };
  }

  const resetToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000);

  await passwordResetTokenRepository.createPasswordResetToken({
    userId: user.id,
    token: hashToken(resetToken),
    expiresAt,
  });

  sendPasswordResetEmail(user.email, resetToken);

  return { message: PASSWORD_RESET_PUBLIC_MESSAGE };
}

async function resetPassword(input) {
  const tokenHash = hashToken(input.token);
  const passwordResetToken = await passwordResetTokenRepository.findPasswordResetToken(tokenHash);

  assertPasswordResetTokenIsValid(passwordResetToken);

  await userRepository.updateUserPassword(passwordResetToken.userId, await hashPassword(input.newPassword));
  await passwordResetTokenRepository.markPasswordResetTokenAsUsed(passwordResetToken.id);

  return { message: 'Password updated successfully' };
}

async function validateResetToken(input) {
  const tokenHash = hashToken(input.token);
  const passwordResetToken = await passwordResetTokenRepository.findPasswordResetToken(tokenHash);

  assertPasswordResetTokenIsValid(passwordResetToken);

  return { valid: true };
}

function assertPasswordResetTokenIsValid(passwordResetToken) {
  if (!passwordResetToken || passwordResetToken.usedAt) {
    throw new AppError('Password reset token is invalid', 400, ERROR_CODES.PASSWORD_RESET_TOKEN_INVALID);
  }

  if (passwordResetToken.expiresAt <= new Date()) {
    throw new AppError('Password reset token has expired', 400, ERROR_CODES.PASSWORD_RESET_TOKEN_EXPIRED);
  }
}

module.exports = { register, login, forgotPassword, resetPassword, validateResetToken, serializeUser };
