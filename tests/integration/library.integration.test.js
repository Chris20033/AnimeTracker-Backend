require('./setup');

const request = require('supertest');

const app = require('../../src/app');
const { cleanDatabase, disconnectDatabase } = require('../helpers/db');
const { authHeader, createTestAnime, createTestUser } = require('../helpers/factories');

describe('library endpoints', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('adds, updates and deletes a library entry', async () => {
    const { accessToken } = await createTestUser();
    await createTestAnime({ externalId: '7442', title: 'Attack on Titan', episodes: 25 });

    const createResponse = await request(app)
      .post('/api/library')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442', status: 'WATCHING' })
      .expect(201);

    const entryId = createResponse.body.data.id;
    expect(createResponse.body.data).toMatchObject({ status: 'WATCHING', episodesWatched: 0 });

    const updateResponse = await request(app)
      .patch(`/api/library/${entryId}`)
      .set(authHeader(accessToken))
      .send({ episodesWatched: 5, personalScore: 8 })
      .expect(200);

    expect(updateResponse.body.data).toMatchObject({ episodesWatched: 5, personalScore: 8 });

    await request(app).delete(`/api/library/${entryId}`).set(authHeader(accessToken)).expect(204);

    const listResponse = await request(app).get('/api/library').set(authHeader(accessToken)).expect(200);
    expect(listResponse.body.data).toHaveLength(0);
  });

  it('rejects duplicate library entries', async () => {
    const { accessToken } = await createTestUser();
    await createTestAnime({ externalId: '7442' });

    await request(app)
      .post('/api/library')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442' })
      .expect(201);

    const response = await request(app)
      .post('/api/library')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442' })
      .expect(409);

    expect(response.body.error.code).toBe('ANIME_ALREADY_IN_LIBRARY');
  });

  it('rejects watched episodes greater than anime episodes', async () => {
    const { accessToken } = await createTestUser();
    await createTestAnime({ externalId: '7442', episodes: 12 });

    const createResponse = await request(app)
      .post('/api/library')
      .set(authHeader(accessToken))
      .send({ source: 'KITSU', externalId: '7442' })
      .expect(201);

    const response = await request(app)
      .patch(`/api/library/${createResponse.body.data.id}`)
      .set(authHeader(accessToken))
      .send({ episodesWatched: 13 })
      .expect(422);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details[0].field).toBe('episodesWatched');
  });
});
