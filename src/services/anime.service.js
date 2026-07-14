const { ERROR_CODES } = require('../constants/errorCodes');
const animeRepository = require('../repositories/anime.repository');
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
    throw new AppError('Anime source is not supported', 400, ERROR_CODES.VALIDATION_ERROR, [
      {
        field: 'source',
        message: `Only ${KITSU_SOURCE} is supported`,
      },
    ]);
  }

  return externalAnimeService.getAnimeDetail(externalId);
}

async function findOrCreateAnime({ source, externalId }) {
  const existingAnime = await animeRepository.findAnimeBySourceAndExternalId(source, externalId);

  if (existingAnime) {
    return refreshAnimeSearchDataIfNeeded(existingAnime);
  }

  const detail = await getAnimeDetail({ source, externalId });

  return animeRepository.createAnime(mapAnimeDetailToPersistence(detail));
}

async function refreshAnimeSearchDataIfNeeded(anime) {
  if (anime.alternativeTitles.length > 0 && anime.searchText) {
    return anime;
  }

  const detail = await getAnimeDetail({ source: anime.source, externalId: anime.externalId });

  return animeRepository.updateAnime(anime.id, mapAnimeDetailToPersistence(detail));
}

function mapAnimeDetailToPersistence(detail) {
  return {
    externalId: detail.externalId,
    source: detail.source,
    title: detail.title,
    titleEnglish: detail.titleEnglish,
    alternativeTitles: detail.alternativeTitles,
    searchText: detail.searchText,
    synopsis: detail.synopsis,
    imageUrl: detail.imageUrl,
    episodes: detail.episodes,
    duration: detail.duration,
    status: detail.status,
    type: detail.type,
    season: detail.season,
    year: detail.year,
    score: detail.score,
    genres: detail.genres,
  };
}

module.exports = { searchAnime, getAnimeCatalog, getAnimeGenres, getAnimeDetail, findOrCreateAnime };
