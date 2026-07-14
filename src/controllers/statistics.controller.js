const statisticsService = require('../services/statistics.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getMyStatistics = asyncHandler(async (req, res) => {
  const data = await statisticsService.getMyStatistics(req.user.id);

  return sendSuccess(res, data);
});

const getPublicStatistics = asyncHandler(async (req, res) => {
  const data = await statisticsService.getPublicStatistics(req.validated.params.username);

  return sendSuccess(res, data);
});

module.exports = { getMyStatistics, getPublicStatistics };
