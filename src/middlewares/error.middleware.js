const { env } = require('../config/env');

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  const payload = {
    error: {
      code,
      message,
      details: err.details || [],
    },
  };

  if (env.nodeEnv !== 'production' && err.stack) {
    payload.error.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}

module.exports = { errorMiddleware };
