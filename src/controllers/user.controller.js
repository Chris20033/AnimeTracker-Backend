const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  const data = await userService.getMe(req.user.id);

  return sendSuccess(res, data);
});

const updateMe = asyncHandler(async (req, res) => {
  const data = await userService.updateMe(req.user.id, req.validated.body);

  return sendSuccess(res, data);
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const data = await userService.getPublicProfile(req.params.username);

  return sendSuccess(res, data);
});

module.exports = { getMe, updateMe, getPublicProfile };
