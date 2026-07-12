const { ERROR_CODES } = require('../constants/errorCodes');
const { KITSU_SOURCE } = require('../integrations/kitsu/kitsu.mapper');
const externalAnimeService = require('./externalAnime.service');
const { AppError } = require('../utils/AppError');

async function searchAnime(query) {
  return externalAnimeService.searchAnime(query);
}

async function getAnimeCatalog(filters) {
  return externalAnimeService.getAnimeCatalog(filters);
}

async function getAnimeGenres() {
  return externalAnimeService.getAnimeGenres();
}

async function getAnimeDetail({ source, externalId }) {
  if (source !== KITSU_SOURCE) {
    throw new AppError('Anime source is not supported', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  return externalAnimeService.getAnimeDetail(externalId);
}

module.exports = { searchAnime, getAnimeCatalog, getAnimeGenres, getAnimeDetail };
