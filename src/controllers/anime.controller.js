const animeService = require('../services/anime.service');
const { sendPaginated, sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const searchAnime = asyncHandler(async (req, res) => {
  const result = await animeService.searchAnime(req.validated.query);

  return sendPaginated(res, result.data, result.pagination);
});

const getAnimeCatalog = asyncHandler(async (req, res) => {
  const result = await animeService.getAnimeCatalog(req.validated.query);

  return sendPaginated(res, result.data, result.pagination);
});

const getAnimeGenres = asyncHandler(async (req, res) => {
  const data = await animeService.getAnimeGenres();

  return sendSuccess(res, data);
});

const getAnimeDetail = asyncHandler(async (req, res) => {
  const data = await animeService.getAnimeDetail(req.validated.params);

  return sendSuccess(res, data);
});

module.exports = { searchAnime, getAnimeCatalog, getAnimeGenres, getAnimeDetail };
