require('./setup');

const request = require('supertest');

const app = require('../../src/app');
const { cleanDatabase, disconnectDatabase } = require('../helpers/db');

describe('api middlewares', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('rejects protected routes without token', async () => {
    const response = await request(app).get('/api/users/me').expect(401);

    expect(response.body.error.code).toBe('AUTH_TOKEN_REQUIRED');
  });

  it('returns validation errors for invalid payloads', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'ab', email: 'invalid', password: 'short' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  it('returns not found errors consistently', async () => {
    const response = await request(app).get('/api/unknown-route').expect(404);

    expect(response.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});
