const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DOTENV_CONFIG_QUIET: 'true',
    },
    include: ['tests/**/*.test.js'],
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
