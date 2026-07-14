const { env } = require('../../config/env');
const { ERROR_CODES } = require('../../constants/errorCodes');
const { AppError } = require('../../utils/AppError');

const KITSU_TIMEOUT_MS = 8000;
const KITSU_CACHE_TTL_MS = 1000 * 60 * 10;
const KITSU_RETRY_DELAYS_MS = [500, 1000];
const TRANSIENT_STATUS_CODES = new Set([500, 502, 503, 504]);
const responseCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pageToOffset(page, limit) {
  return (page - 1) * limit;
}

async function requestKitsu(path, searchParams = {}) {
  const url = new URL(`${env.kitsuBaseUrl}${path}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const cacheKey = url.toString();
  const cachedResponse = responseCache.get(cacheKey);

  if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
    return cachedResponse.data;
  }

  try {
    const data = await requestKitsuWithRetry(url);
    responseCache.set(cacheKey, {
      data,
      expiresAt: Date.now() + KITSU_CACHE_TTL_MS,
    });
    return data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('External anime API request failed', 503, ERROR_CODES.EXTERNAL_ANIME_API_ERROR);
  }
}

async function requestKitsuWithRetry(url) {
  for (let attempt = 0; attempt <= KITSU_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await fetchKitsu(url);
    } catch (error) {
      const shouldRetry = error.isTransient === true && attempt < KITSU_RETRY_DELAYS_MS.length;

      if (!shouldRetry) {
        throw error;
      }

      await sleep(KITSU_RETRY_DELAYS_MS[attempt]);
    }
  }
}

async function fetchKitsu(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), KITSU_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw await createKitsuError(response);
    }

    return response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      const timeoutError = new AppError('External anime provider timed out', 503, ERROR_CODES.EXTERNAL_ANIME_API_ERROR);
      timeoutError.isTransient = true;
      throw timeoutError;
    }

    const requestError = new AppError('External anime provider is temporarily unavailable', 503, ERROR_CODES.EXTERNAL_ANIME_API_ERROR);
    requestError.isTransient = true;
    throw requestError;
  } finally {
    clearTimeout(timeout);
  }
}

async function readKitsuErrorBody(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function buildProviderDetails(response, body) {
  const firstError = Array.isArray(body?.errors) ? body.errors[0] : null;

  return [
    {
      provider: 'KITSU',
      providerStatus: response.status,
      providerType: firstError?.code || firstError?.title || null,
      providerMessage: firstError?.detail || firstError?.title || null,
    },
  ];
}

async function createKitsuError(response) {
  const body = await readKitsuErrorBody(response);
  const details = buildProviderDetails(response, body);
  const providerMessage = details[0].providerMessage || 'External anime provider request failed';

  if (response.status === 400) {
    return new AppError(providerMessage, 400, ERROR_CODES.EXTERNAL_ANIME_API_BAD_REQUEST, details);
  }

  if (response.status === 404) {
    return new AppError(providerMessage || 'Anime not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND, details);
  }

  if (response.status === 429) {
    return new AppError('External anime provider rate limit exceeded', 429, ERROR_CODES.EXTERNAL_ANIME_API_RATE_LIMITED, details);
  }

  const error = new AppError(providerMessage, 503, ERROR_CODES.EXTERNAL_ANIME_API_ERROR, details);
  error.isTransient = TRANSIENT_STATUS_CODES.has(response.status);
  return error;
}

function searchAnime({ q, page, limit, offset }) {
  return requestKitsu('/anime', {
    'filter[text]': q,
    'page[limit]': limit,
    'page[offset]': offset ?? pageToOffset(page, limit),
  });
}

function getAnimeCatalog(filters) {
  return requestKitsu('/anime', buildAnimeCatalogParams(filters));
}

function buildAnimeCatalogParams(filters) {
  const params = {
    'page[limit]': filters.limit,
    'page[offset]': filters.offset ?? pageToOffset(filters.page, filters.limit),
  };

  if (filters.q) params['filter[text]'] = filters.q;
  if (filters.type) params['filter[subtype]'] = mapSubtype(filters.type);
  if (filters.status) params['filter[status]'] = mapStatus(filters.status);
  if (filters.rating) params['filter[ageRating]'] = mapRating(filters.rating);
  if (filters.genres) params['filter[categories]'] = filters.genres;
  if (filters.order_by) params.sort = mapSort(filters.order_by, filters.sort);

  if (!params.sort) {
    params.sort = 'popularityRank';
  }

  return params;
}

function mapSubtype(type) {
  const subtypes = {
    tv: 'TV',
    movie: 'movie',
    ova: 'OVA',
    ona: 'ONA',
    special: 'special',
    music: 'music',
    cm: 'CM',
    pv: 'PV',
    tv_special: 'special',
  };

  return subtypes[type] || type;
}

function mapStatus(status) {
  const statuses = {
    airing: 'current',
    current: 'current',
    complete: 'finished',
    finished: 'finished',
    upcoming: 'upcoming',
  };

  return statuses[status] || status;
}

function mapRating(rating) {
  const ratings = {
    g: 'G',
    pg: 'PG',
    pg13: 'PG',
    r17: 'R',
    r: 'R',
    rx: 'R18',
    r18: 'R18',
  };

  return ratings[rating] || rating;
}

function mapSort(orderBy, sort = 'desc') {
  const isDesc = sort === 'desc';
  const fields = {
    mal_id: 'id',
    title: 'canonicalTitle',
    start_date: 'startDate',
    end_date: 'endDate',
    episodes: 'episodeCount',
    score: 'averageRating',
    scored_by: 'userCount',
    rank: 'ratingRank',
    popularity: 'popularityRank',
    members: 'userCount',
    favorites: 'favoritesCount',
  };
  const field = fields[orderBy] || 'popularityRank';

  if (field === 'popularityRank' || field === 'ratingRank') {
    return isDesc ? field : `-${field}`;
  }

  return isDesc ? `-${field}` : field;
}

function getAnimeCategories() {
  return requestKitsu('/categories', {
    'page[limit]': 500,
    'page[offset]': 0,
  });
}

function getAnimeDetail(externalId) {
  return requestKitsu(`/anime/${externalId}`, { include: 'categories' });
}

function getTrendingAnime({ limit }) {
  return requestKitsu('/trending/anime', { limit });
}

function getTopAiringAnime({ limit }) {
  return requestKitsu('/anime', {
    'filter[status]': 'current',
    sort: '-averageRating',
    'page[limit]': limit,
    'page[offset]': 0,
  });
}

function getPopularAnime({ page = 1, limit }) {
  return requestKitsu('/anime', {
    sort: 'popularityRank',
    'page[limit]': limit,
    'page[offset]': pageToOffset(page, limit),
  });
}

function getSeasonalAnime({ season, year, limit }) {
  return requestKitsu('/anime', {
    'filter[season]': season,
    'filter[seasonYear]': year,
    'filter[status]': 'current',
    'page[limit]': limit,
    'page[offset]': 0,
  });
}

function getUpcomingAnime({ limit }) {
  return requestKitsu('/anime', {
    'filter[status]': 'upcoming',
    'page[limit]': limit,
    'page[offset]': 0,
  });
}

module.exports = {
  searchAnime,
  getAnimeCatalog,
  getAnimeCategories,
  getAnimeDetail,
  getTrendingAnime,
  getTopAiringAnime,
  getPopularAnime,
  getSeasonalAnime,
  getUpcomingAnime,
};
