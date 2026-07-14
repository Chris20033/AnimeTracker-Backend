const kitsuClient = require('../integrations/kitsu/kitsu.client');
const { mapHomeItem } = require('../integrations/kitsu/kitsu.mapper');

const HOME_LIMIT = 10;
const HERO_LIMIT = 10;

function mapList(response) {
  return Array.isArray(response.data) ? response.data.map(mapHomeItem) : [];
}

async function getFeatured() {
  const response = await kitsuClient.getTrendingAnime({ limit: HERO_LIMIT });
  return mapList(response);
}

async function getTopAiring() {
  const response = await kitsuClient.getTopAiringAnime({ limit: HOME_LIMIT });
  return mapList(response);
}

async function getPopular() {
  const response = await kitsuClient.getPopularAnime({ limit: HOME_LIMIT });
  return mapList(response);
}

async function getSeasonal() {
  const response = await kitsuClient.getSeasonalAnime({ season: getCurrentSeason(), year: new Date().getFullYear(), limit: HOME_LIMIT });
  return mapList(response);
}

async function getUpcoming() {
  const response = await kitsuClient.getUpcomingAnime({ limit: HOME_LIMIT });
  return mapList(response);
}

async function getRecommendations() {
  const response = await kitsuClient.getPopularAnime({ limit: HOME_LIMIT });
  return mapList(response);
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;

  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'fall';
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
  const topAiring = await getSafeSection(getTopAiring);
  const seasonal = await getSafeSection(getSeasonal);
  const upcoming = await getSafeSection(getUpcoming);
  const popular = await getSafeSection(getPopular);
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
