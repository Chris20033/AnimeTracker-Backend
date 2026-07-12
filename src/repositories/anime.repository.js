const { prisma } = require('../config/database');

function findAnimeBySourceAndExternalId(source, externalId) {
  return prisma.anime.findUnique({
    where: {
      source_externalId: {
        source,
        externalId,
      },
    },
  });
}

function createAnime(data) {
  const { genres = [], ...animeData } = data;

  return prisma.anime.create({
    data: {
      ...animeData,
      genres: {
        create: genres.map((name) => ({
          genre: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
  });
}

module.exports = { findAnimeBySourceAndExternalId, createAnime };
