const { loginSchema, registerSchema } = require('../../src/schemas/auth.schema');
const { addFavoriteSchema } = require('../../src/schemas/favorite.schema');
const { updateLibrarySchema } = require('../../src/schemas/library.schema');

describe('schemas', () => {
  it('normalizes auth email input', () => {
    const result = registerSchema.safeParse({
      body: { username: 'tester', email: 'USER@Example.COM', password: 'Password123' },
    });

    expect(result.success).toBe(true);
    expect(result.data.body.email).toBe('user@example.com');
  });

  it('rejects invalid login email', () => {
    const result = loginSchema.safeParse({ body: { email: 'invalid', password: 'x' } });

    expect(result.success).toBe(false);
  });

  it('rejects invalid favorite source', () => {
    const result = addFavoriteSchema.safeParse({ body: { source: 'JIKAN', externalId: '1' } });

    expect(result.success).toBe(false);
  });

  it('requires at least one library update field', () => {
    const result = updateLibrarySchema.safeParse({
      params: { id: '8f34b00e-c5ee-4b04-9a07-63b3afdcce1f' },
      body: {},
    });

    expect(result.success).toBe(false);
  });
});
