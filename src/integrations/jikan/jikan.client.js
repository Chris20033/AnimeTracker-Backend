const { env } = require('../../config/env');
const { ERROR_CODES } = require('../../constants/errorCodes');
const { AppError } = require('../../utils/AppError');

const JIKAN_TIMEOUT_MS = 8000;

async function requestJikan(path, searchParams = {}) {
  const url = new URL(`${env.jikanBaseUrl}${path}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), JIKAN_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (response.status === 404) {
      throw new AppError('Anime not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    if (!response.ok) {
      throw new AppError('External anime API request failed', 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }

    return response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new AppError('External anime API request timed out', 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }

    throw new AppError('External anime API request failed', 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
  } finally {
    clearTimeout(timeout);
  }
}

function searchAnime({ q, page, limit }) {
  return requestJikan('/anime', { q, page, limit });
}

function getAnimeCatalog(filters) {
  return requestJikan('/anime', filters);
}

function getAnimeGenres() {
  return requestJikan('/genres/anime');
}

function getAnimeFull(externalId) {
  return requestJikan(`/anime/${externalId}/full`);
}

function getTopAnime({ filter, page, limit }) {
  return requestJikan('/top/anime', { filter, page, limit });
}

function getCurrentSeason({ page, limit }) {
  return requestJikan('/seasons/now', { page, limit });
}

function getUpcomingSeason({ page, limit }) {
  return requestJikan('/seasons/upcoming', { page, limit });
}

function getAnimeRecommendations({ page }) {
  return requestJikan('/recommendations/anime', { page });
}

module.exports = {
  searchAnime,
  getAnimeCatalog,
  getAnimeGenres,
  getAnimeFull,
  getTopAnime,
  getCurrentSeason,
  getUpcomingSeason,
  getAnimeRecommendations,
};
