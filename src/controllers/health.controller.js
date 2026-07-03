const { sendSuccess } = require('../utils/apiResponse');

function getHealth(req, res) {
  return sendSuccess(res, {
    status: 'ok',
    service: 'animetracker-api',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
