require('./setup');

const request = require('supertest');

const app = require('../../src/app');
const { cleanDatabase, disconnectDatabase } = require('../helpers/db');
const { authHeader, createTestUser } = require('../helpers/factories');

describe('user endpoints', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('returns the authenticated private profile', async () => {
    const { accessToken } = await createTestUser({ username: 'tester', email: 'tester@example.com' });

    const response = await request(app)
      .get('/api/users/me')
      .set(authHeader(accessToken))
      .expect(200);

    expect(response.body.data).toMatchObject({ username: 'tester', email: 'tester@example.com' });
    expect(response.body.data.passwordHash).toBeUndefined();
  });

  it('returns RESOURCE_NOT_FOUND for missing public profile', async () => {
    const response = await request(app).get('/api/users/missing-user').expect(404);

    expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('rejects invalid profile image uploads', async () => {
    const { accessToken } = await createTestUser();

    const response = await request(app)
      .patch('/api/users/me')
      .set(authHeader(accessToken))
      .attach('avatar', Buffer.from('not an image'), { filename: 'avatar.txt', contentType: 'text/plain' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details[0].field).toBe('avatar');
  });
});
