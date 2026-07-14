require('./setup');

const request = require('supertest');

const app = require('../../src/app');
const { cleanDatabase, disconnectDatabase } = require('../helpers/db');
const { authHeader, createTestAnime, createTestUser } = require('../helpers/factories');

describe('favorite endpoints', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('adds and deletes a favorite', async () => {
    const { accessToken } = await createTestUser();
    await createTestAnime({ externalId: '7442' });

    const createResponse = await request(app)
      .post('/api/favorites')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442' })
      .expect(201);

    expect(createResponse.body.data.anime.externalId).toBe('7442');

    await request(app).delete(`/api/favorites/${createResponse.body.data.id}`).set(authHeader(accessToken)).expect(204);

    const listResponse = await request(app).get('/api/favorites').set(authHeader(accessToken)).expect(200);
    expect(listResponse.body.data).toHaveLength(0);
  });

  it('rejects duplicate favorites', async () => {
    const { accessToken } = await createTestUser();
    await createTestAnime({ externalId: '7442' });

    await request(app)
      .post('/api/favorites')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442' })
      .expect(201);

    const response = await request(app)
      .post('/api/favorites')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442' })
      .expect(409);

    expect(response.body.error.code).toBe('FAVORITE_ALREADY_EXISTS');
  });
});
