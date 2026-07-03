const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.validated.body);

  return sendSuccess(res, data, 201);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.validated.body);

  return sendSuccess(res, data);
});

function logout(req, res) {
  return res.status(204).send();
}

const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.validated.body);

  return res.status(200).json(data);
});

const resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.validated.body);

  return res.status(200).json(data);
});

const validateResetToken = asyncHandler(async (req, res) => {
  const data = await authService.validateResetToken(req.validated.body);

  return sendSuccess(res, data);
});

module.exports = { register, login, logout, forgotPassword, resetPassword, validateResetToken };
