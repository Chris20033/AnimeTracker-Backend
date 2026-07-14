const kitsuClient = require('../integrations/kitsu/kitsu.client');
const { mapCategory, mapDetail, mapPagination, mapSearchItem } = require('../integrations/kitsu/kitsu.mapper');

const KITSU_MAX_PAGE_LIMIT = 20;

async function fetchAnimeCollection(fetchPage, query) {
  if (query.q) {
    return fetchSearchCollection(fetchPage, query);
  }

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

async function fetchSearchCollection(fetchPage, query) {
  const requestedStart = (query.page - 1) * query.limit;
  const requestedEnd = requestedStart + query.limit;
  const providerWindowSize = KITSU_MAX_PAGE_LIMIT * 2;
  const windowsNeeded = Math.max(1, Math.ceil(requestedEnd / KITSU_MAX_PAGE_LIMIT));
  const requests = [];

  for (let windowIndex = 0; windowIndex < windowsNeeded; windowIndex += 1) {
    requests.push(fetchPage({ ...query, limit: KITSU_MAX_PAGE_LIMIT, offset: windowIndex * providerWindowSize }));
  }

  const responses = await Promise.all(requests);
  const uniqueItems = dedupeAnimeResources(responses.flatMap((response) => (Array.isArray(response.data) ? response.data : [])));

  return {
    data: uniqueItems.slice(requestedStart, requestedEnd),
    meta: responses[0]?.meta || {},
  };
}

function dedupeAnimeResources(resources) {
  const seen = new Set();

  return resources.filter((resource) => {
    const key = `${resource.type}:${resource.id}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
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
