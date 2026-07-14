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

function updateAnime(id, data) {
  const { genres, ...animeData } = data;

  return prisma.anime.update({
    where: { id },
    data: animeData,
  });
}

module.exports = { findAnimeBySourceAndExternalId, createAnime, updateAnime };
