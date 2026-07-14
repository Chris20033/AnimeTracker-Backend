const homeService = require('../services/home.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getHome = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getHome()));
const getFeatured = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getFeatured()));
const getTopAiring = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getTopAiring()));
const getSeasonal = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getSeasonal()));
const getUpcoming = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getUpcoming()));
const getPopular = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getPopular()));
const getRecommendations = asyncHandler(async (req, res) => sendSuccess(res, await homeService.getRecommendations()));

module.exports = {
  getHome,
  getFeatured,
  getTopAiring,
  getSeasonal,
  getUpcoming,
  getPopular,
  getRecommendations,
};
