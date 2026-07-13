const { ERROR_CODES } = require('../constants/errorCodes');
const statisticsRepository = require('../repositories/statistics.repository');
const userRepository = require('../repositories/user.repository');
const { AppError } = require('../utils/AppError');

const LIBRARY_STATUSES = ['WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH'];
const TOP_GENRES_LIMIT = 5;

async function getMyStatistics(userId) {
  return getStatisticsForUserId(userId);
}

async function getPublicStatistics(username) {
  const user = await userRepository.findUserByUsername(username);

  if (!user || !user.isActive) {
    throw new AppError('User not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  return {
    username: user.username,
    ...(await getStatisticsForUserId(user.id)),
  };
}

async function getStatisticsForUserId(userId) {
  const entries = await statisticsRepository.findLibraryEntriesForStatistics(userId);

  return buildStatistics(entries);
}

function buildStatistics(entries) {
  const scoredEntries = entries.filter((entry) => entry.personalScore !== null && entry.personalScore !== undefined);

  return {
    totalAnime: entries.length,
    completedAnime: entries.filter((entry) => entry.status === 'COMPLETED').length,
    totalEpisodesWatched: entries.reduce((total, entry) => total + entry.episodesWatched, 0),
    averageScore: getAverageScore(scoredEntries),
    topGenres: getTopGenres(entries),
    statusDistribution: getStatusDistribution(entries),
  };
}

function getAverageScore(scoredEntries) {
  if (scoredEntries.length === 0) {
    return null;
  }

  const total = scoredEntries.reduce((sum, entry) => sum + entry.personalScore, 0);

  return Math.round((total / scoredEntries.length) * 100) / 100;
}

function getTopGenres(entries) {
  const genreCounts = new Map();

  entries.forEach((entry) => {
    entry.anime.genres.forEach(({ genre }) => {
      genreCounts.set(genre.name, (genreCounts.get(genre.name) || 0) + 1);
    });
  });

  return Array.from(genreCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, TOP_GENRES_LIMIT);
}

function getStatusDistribution(entries) {
  const distribution = Object.fromEntries(LIBRARY_STATUSES.map((status) => [status, 0]));

  entries.forEach((entry) => {
    distribution[entry.status] += 1;
  });

  return distribution;
}

module.exports = { getMyStatistics, getPublicStatistics, getStatisticsForUserId };
