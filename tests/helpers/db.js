const { prisma } = require('../../src/config/database');

function assertTestDatabase() {
  const url = process.env.DATABASE_URL || '';

  if (!url.includes('animetracker_test')) {
    throw new Error('Integration tests require DATABASE_URL_TEST pointing to animetracker_test.');
  }
}

async function cleanDatabase() {
  assertTestDatabase();

  await prisma.$transaction([
    prisma.favorite.deleteMany(),
    prisma.userAnimeList.deleteMany(),
    prisma.animeGenre.deleteMany(),
    prisma.genre.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.anime.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = { assertTestDatabase, cleanDatabase, disconnectDatabase, prisma };
