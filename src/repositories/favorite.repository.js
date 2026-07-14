const { prisma } = require('../config/database');

const favoriteInclude = {
  anime: true,
};

function findFavoritesByUser(userId) {
  return prisma.favorite.findMany({
    where: { userId },
    include: favoriteInclude,
    orderBy: { createdAt: 'desc' },
  });
}

function findPublicFavoritesByUserId(userId, limit = 12) {
  return prisma.favorite.findMany({
    where: { userId },
    include: favoriteInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

function findFavoriteById(userId, id) {
  return prisma.favorite.findFirst({
    where: { id, userId },
    include: favoriteInclude,
  });
}

function findFavoriteByAnime(userId, animeId) {
  return prisma.favorite.findUnique({
    where: {
      userId_animeId: {
        userId,
        animeId,
      },
    },
    include: favoriteInclude,
  });
}

function createFavorite(data) {
  return prisma.favorite.create({
    data,
    include: favoriteInclude,
  });
}

function deleteFavorite(id) {
  return prisma.favorite.delete({ where: { id } });
}

module.exports = {
  findFavoritesByUser,
  findPublicFavoritesByUserId,
  findFavoriteById,
  findFavoriteByAnime,
  createFavorite,
  deleteFavorite,
};
