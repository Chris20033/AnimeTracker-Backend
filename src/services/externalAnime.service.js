const jikanClient = require('../integrations/jikan/jikan.client');
const { mapDetail, mapGenre, mapPagination, mapSearchItem } = require('../integrations/jikan/jikan.mapper');

async function searchAnime(query) {
  const response = await jikanClient.searchAnime(query);

  return {
    data: Array.isArray(response.data) ? response.data.map(mapSearchItem) : [],
    pagination: mapPagination(response.pagination, query.page, query.limit),
  };
}

async function getAnimeCatalog(filters) {
  const response = await jikanClient.getAnimeCatalog(filters);

  return {
    data: Array.isArray(response.data) ? response.data.map(mapSearchItem) : [],
    pagination: mapPagination(response.pagination, filters.page, filters.limit),
  };
}

async function getAnimeGenres() {
  const response = await jikanClient.getAnimeGenres();

  return Array.isArray(response.data) ? response.data.map(mapGenre) : [];
}

async function getAnimeDetail(externalId) {
  const response = await jikanClient.getAnimeFull(externalId);

  return mapDetail(response.data);
}

module.exports = { searchAnime, getAnimeCatalog, getAnimeGenres, getAnimeDetail };
