const jikanClient = require('../integrations/jikan/jikan.client');
const { mapHomeItem, mapRecommendationItem } = require('../integrations/jikan/jikan.mapper');

const HOME_LIMIT = 10;
const HERO_LIMIT = 5;
const JIKAN_REQUEST_GAP_MS = 800;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function mapList(response) {
  return Array.isArray(response.data) ? response.data.map(mapHomeItem) : [];
}

async function getFeatured() {
  const response = await jikanClient.getTopAnime({ filter: 'airing', page: 1, limit: HERO_LIMIT });
  return mapList(response);
}

async function getTopAiring() {
  const response = await jikanClient.getTopAnime({ filter: 'airing', page: 1, limit: HOME_LIMIT });
  return mapList(response);
}

async function getPopular() {
  const response = await jikanClient.getTopAnime({ filter: 'bypopularity', page: 1, limit: HOME_LIMIT });
  return mapList(response);
}

async function getSeasonal() {
  const response = await jikanClient.getCurrentSeason({ page: 1, limit: HOME_LIMIT });
  return mapList(response);
}

async function getUpcoming() {
  const response = await jikanClient.getUpcomingSeason({ page: 1, limit: HOME_LIMIT });
  return mapList(response);
}

async function getRecommendations() {
  const response = await jikanClient.getAnimeRecommendations({ page: 1 });
  return Array.isArray(response.data)
    ? response.data.map(mapRecommendationItem).filter(Boolean).slice(0, HOME_LIMIT)
    : [];
}

async function getSafeSection(sectionLoader) {
  try {
    return await sectionLoader();
  } catch (error) {
    return [];
  }
}

async function getHome() {
  const featured = await getSafeSection(getFeatured);
  await wait(JIKAN_REQUEST_GAP_MS);
  const topAiring = await getSafeSection(getTopAiring);
  await wait(JIKAN_REQUEST_GAP_MS);
  const seasonal = await getSafeSection(getSeasonal);
  await wait(JIKAN_REQUEST_GAP_MS);
  const upcoming = await getSafeSection(getUpcoming);
  await wait(JIKAN_REQUEST_GAP_MS);
  const popular = await getSafeSection(getPopular);
  await wait(JIKAN_REQUEST_GAP_MS);
  const recommendations = await getSafeSection(getRecommendations);

  return {
    hero: featured[0] || null,
    sections: {
      featured,
      topAiring,
      seasonal,
      upcoming,
      popular,
      recommendations,
    },
  };
}

module.exports = {
  getHome,
  getFeatured,
  getTopAiring,
  getSeasonal,
  getUpcoming,
  getPopular,
  getRecommendations,
};
