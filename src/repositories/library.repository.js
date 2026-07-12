const { prisma } = require('../config/database');

const libraryInclude = {
  anime: true,
};

function countLibraryEntries(userId, filters = {}) {
  return prisma.userAnimeList.count({ where: buildWhere(userId, filters) });
}

function findLibraryEntries(userId, filters = {}, { skip, take }) {
  return prisma.userAnimeList.findMany({
    where: buildWhere(userId, filters),
    include: libraryInclude,
    orderBy: { updatedAt: 'desc' },
    skip,
    take,
  });
}

function findLibraryEntryById(userId, id) {
  return prisma.userAnimeList.findFirst({
    where: { id, userId },
    include: libraryInclude,
  });
}

function findLibraryEntryByAnime(userId, animeId) {
  return prisma.userAnimeList.findUnique({
    where: {
      userId_animeId: {
        userId,
        animeId,
      },
    },
    include: libraryInclude,
  });
}

function createLibraryEntry(data) {
  return prisma.userAnimeList.create({
    data,
    include: libraryInclude,
  });
}

function updateLibraryEntry(id, data) {
  return prisma.userAnimeList.update({
    where: { id },
    data,
    include: libraryInclude,
  });
}

function deleteLibraryEntry(id) {
  return prisma.userAnimeList.delete({ where: { id } });
}

function buildWhere(userId, filters) {
  const where = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  return where;
}

module.exports = {
  countLibraryEntries,
  findLibraryEntries,
  findLibraryEntryById,
  findLibraryEntryByAnime,
  createLibraryEntry,
  updateLibraryEntry,
  deleteLibraryEntry,
};
