const { env } = require('./env');

const corsOptions = {
  origin: env.corsOrigin,
};

module.exports = { corsOptions };
