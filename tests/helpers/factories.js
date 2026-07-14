const { prisma } = require('./db');
const { hashPassword } = require('../../src/utils/password');
const { signAccessToken } = require('../../src/utils/jwt');

let sequence = 0;

function nextId(prefix) {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
}

async function createTestUser(overrides = {}) {
  const username = overrides.username || nextId('user');
  const email = overrides.email || `${username}@example.com`;
  const password = overrides.password || 'Password123';

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: await hashPassword(password),
      ...overrides.data,
    },
  });

  return { user, password, accessToken: signAccessToken(user) };
}

async function createTestAnime(overrides = {}) {
  return prisma.anime.create({
    data: {
      source: 'KITSU',
      externalId: nextId('100'),
      title: 'Test Anime',
      alternativeTitles: ['Test Anime Alt'],
      searchText: 'test anime',
      episodes: 12,
      genres: {
        create: [
          { genre: { connectOrCreate: { where: { name: 'Action' }, create: { name: 'Action' } } } },
          { genre: { connectOrCreate: { where: { name: 'Drama' }, create: { name: 'Drama' } } } },
        ],
      },
      ...overrides,
    },
  });
}

function authHeader(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

module.exports = { authHeader, createTestAnime, createTestUser };
