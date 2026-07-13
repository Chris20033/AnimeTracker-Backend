const { prisma } = require('../config/database');

function findLibraryEntriesForStatistics(userId) {
  return prisma.userAnimeList.findMany({
    where: { userId },
    select: {
      status: true,
      episodesWatched: true,
      personalScore: true,
      anime: {
        select: {
          genres: {
            select: {
              genre: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });
}

module.exports = { findLibraryEntriesForStatistics };
