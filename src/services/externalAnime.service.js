const kitsuClient = require('../integrations/kitsu/kitsu.client');
const { mapCategory, mapDetail, mapPagination, mapSearchItem } = require('../integrations/kitsu/kitsu.mapper');

const KITSU_MAX_PAGE_LIMIT = 20;

async function fetchAnimeCollection(fetchPage, query) {
  if (query.limit <= KITSU_MAX_PAGE_LIMIT) {
    return fetchPage(query);
  }

  const startOffset = (query.page - 1) * query.limit;
  const requests = [];

  for (let fetched = 0; fetched < query.limit; fetched += KITSU_MAX_PAGE_LIMIT) {
    const limit = Math.min(KITSU_MAX_PAGE_LIMIT, query.limit - fetched);
    requests.push(fetchPage({ ...query, limit, offset: startOffset + fetched }));
  }

  const responses = await Promise.all(requests);

  return {
    data: responses.flatMap((response) => (Array.isArray(response.data) ? response.data : [])),
    meta: responses[0]?.meta || {},
  };
}

async function searchAnime(query) {
  const response = await fetchAnimeCollection(kitsuClient.searchAnime, query);

  return {
    data: Array.isArray(response.data) ? response.data.map(mapSearchItem) : [],
    pagination: mapPagination(response.meta, query.page, query.limit),
  };
}

async function getAnimeCatalog(filters) {
  const response = await fetchAnimeCollection(kitsuClient.getAnimeCatalog, filters);

  return {
    data: Array.isArray(response.data) ? response.data.map(mapSearchItem) : [],
    pagination: mapPagination(response.meta, filters.page, filters.limit),
  };
}

async function getAnimeGenres() {
  const response = await kitsuClient.getAnimeCategories();

  return Array.isArray(response.data) ? response.data.map(mapCategory) : [];
}

async function getAnimeDetail(externalId) {
  const response = await kitsuClient.getAnimeDetail(externalId);

  return mapDetail(response);
}

module.exports = { searchAnime, getAnimeCatalog, getAnimeGenres, getAnimeDetail };
