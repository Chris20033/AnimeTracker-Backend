require('./setup');

const request = require('supertest');

const app = require('../../src/app');
const { cleanDatabase, disconnectDatabase } = require('../helpers/db');

describe('auth endpoints', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('registers and logs in a user', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'tester', email: 'tester@example.com', password: 'Password123' })
      .expect(201);

    expect(registerResponse.body.data.user).toMatchObject({ username: 'tester', email: 'tester@example.com' });
    expect(registerResponse.body.data.accessToken).toEqual(expect.any(String));

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tester@example.com', password: 'Password123' })
      .expect(200);

    expect(loginResponse.body.data.user.username).toBe('tester');
    expect(loginResponse.body.data.accessToken).toEqual(expect.any(String));
  });

  it('rejects duplicate username and email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'tester', email: 'tester@example.com', password: 'Password123' })
      .expect(201);

    const usernameResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'tester', email: 'other@example.com', password: 'Password123' })
      .expect(409);

    expect(usernameResponse.body.error.code).toBe('USERNAME_ALREADY_EXISTS');

    const emailResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'other', email: 'tester@example.com', password: 'Password123' })
      .expect(409);

    expect(emailResponse.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('rejects invalid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'tester', email: 'tester@example.com', password: 'Password123' })
      .expect(201);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tester@example.com', password: 'wrong-password' })
      .expect(401);

    expect(response.body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });
});
