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

  return sendSuccess(res, null, 200, data.message);
});

const resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.validated.body);

  return sendSuccess(res, null, 200, data.message);
});

const validateResetToken = asyncHandler(async (req, res) => {
  const data = await authService.validateResetToken(req.validated.body);

  return sendSuccess(res, data);
});

module.exports = { register, login, logout, forgotPassword, resetPassword, validateResetToken };
