const { errorMiddleware } = require('../../src/middlewares/error.middleware');
const { notFoundMiddleware } = require('../../src/middlewares/notFound.middleware');
const { validate } = require('../../src/middlewares/validate.middleware');
const { loginSchema } = require('../../src/schemas/auth.schema');
const { AppError } = require('../../src/utils/AppError');

function createResponse() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return res;
}

describe('middlewares', () => {
  it('returns validation error details', () => {
    const req = { body: { email: 'bad', password: '' }, params: {}, query: {}, files: undefined };
    const middleware = validate(loginSchema);

    middleware(req, {}, (error) => {
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details.length).toBeGreaterThan(0);
    });
  });

  it('formats app errors consistently', () => {
    const res = createResponse();
    const error = new AppError('Forbidden', 403, 'FORBIDDEN');

    errorMiddleware(error, {}, res, () => {});

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatchObject({ code: 'FORBIDDEN', message: 'Forbidden', details: [] });
  });

  it('creates a RESOURCE_NOT_FOUND error for unknown routes', () => {
    notFoundMiddleware({}, {}, (error) => {
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });
});
