require('./setup');

const request = require('supertest');

const app = require('../../src/app');
const { cleanDatabase, disconnectDatabase, prisma } = require('../helpers/db');
const { authHeader, createTestAnime, createTestUser } = require('../helpers/factories');

describe('statistics endpoints', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('returns empty statistics for a new user', async () => {
    const { accessToken } = await createTestUser({ username: 'tester' });

    const response = await request(app).get('/api/statistics/me').set(authHeader(accessToken)).expect(200);

    expect(response.body.data).toMatchObject({
      totalAnime: 0,
      completedAnime: 0,
      totalEpisodesWatched: 0,
      averageScore: null,
      topGenres: [],
    });
  });

  it('returns private and public statistics from library entries', async () => {
    const { accessToken, user } = await createTestUser({ username: 'tester' });
    const animeOne = await createTestAnime({ externalId: '1', title: 'Anime One' });
    const animeTwo = await createTestAnime({ externalId: '2', title: 'Anime Two' });

    await prisma.userAnimeList.createMany({
      data: [
        { userId: user.id, animeId: animeOne.id, status: 'COMPLETED', episodesWatched: 12, personalScore: 8 },
        { userId: user.id, animeId: animeTwo.id, status: 'WATCHING', episodesWatched: 4, personalScore: 6 },
      ],
    });

    const privateResponse = await request(app).get('/api/statistics/me').set(authHeader(accessToken)).expect(200);

    expect(privateResponse.body.data).toMatchObject({
      totalAnime: 2,
      completedAnime: 1,
      totalEpisodesWatched: 16,
      averageScore: 7,
    });
    expect(privateResponse.body.data.topGenres[0]).toMatchObject({ name: 'Action', count: 2 });

    const publicResponse = await request(app).get('/api/statistics/users/tester').expect(200);

    expect(publicResponse.body.data).toMatchObject({ username: 'tester', totalAnime: 2 });
  });
});
