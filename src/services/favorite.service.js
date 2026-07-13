const { ERROR_CODES } = require('../constants/errorCodes');
const favoriteRepository = require('../repositories/favorite.repository');
const animeService = require('./anime.service');
const { AppError } = require('../utils/AppError');

function serializeFavorite(favorite) {
  return {
    id: favorite.id,
    createdAt: favorite.createdAt,
    anime: serializeAnime(favorite.anime),
  };
}

function serializeAnime(anime) {
  return {
    id: anime.id,
    externalId: anime.externalId,
    source: anime.source,
    title: anime.title,
    titleEnglish: anime.titleEnglish,
    alternativeTitles: anime.alternativeTitles || [],
    imageUrl: anime.imageUrl,
    episodes: anime.episodes,
    status: anime.status,
    type: anime.type,
    year: anime.year,
    score: anime.score,
  };
}

async function getFavorites(userId) {
  const favorites = await favoriteRepository.findFavoritesByUser(userId);

  return favorites.map(serializeFavorite);
}

async function getPublicFavorites(userId, limit = 12) {
  const favorites = await favoriteRepository.findPublicFavoritesByUserId(userId, limit);

  return favorites.map(serializeFavorite);
}

async function addFavorite(userId, input) {
  const anime = await animeService.findOrCreateAnime(input);
  const existingFavorite = await favoriteRepository.findFavoriteByAnime(userId, anime.id);

  if (existingFavorite) {
    throw new AppError('Favorite already exists', 409, ERROR_CODES.FAVORITE_ALREADY_EXISTS);
  }

  const favorite = await favoriteRepository.createFavorite({ userId, animeId: anime.id });

  return serializeFavorite(favorite);
}

async function deleteFavorite(userId, id) {
  const favorite = await favoriteRepository.findFavoriteById(userId, id);

  if (!favorite) {
    throw new AppError('Favorite not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  await favoriteRepository.deleteFavorite(id);
}

module.exports = { getFavorites, getPublicFavorites, addFavorite, deleteFavorite, serializeFavorite };
