process.env.DOTENV_CONFIG_QUIET = 'true';

require('dotenv').config({ quiet: true });

if (!process.env.DATABASE_URL_TEST) {
  throw new Error('DATABASE_URL_TEST is required for integration tests.');
}

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
