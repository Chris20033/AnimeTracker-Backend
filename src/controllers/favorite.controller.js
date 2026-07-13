const favoriteService = require('../services/favorite.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getFavorites = asyncHandler(async (req, res) => {
  const data = await favoriteService.getFavorites(req.user.id);

  return sendSuccess(res, data);
});

const addFavorite = asyncHandler(async (req, res) => {
  const data = await favoriteService.addFavorite(req.user.id, req.validated.body);

  return sendSuccess(res, data, 201);
});

const deleteFavorite = asyncHandler(async (req, res) => {
  await favoriteService.deleteFavorite(req.user.id, req.validated.params.id);

  return res.status(204).send();
});

module.exports = { getFavorites, addFavorite, deleteFavorite };
