function sendSuccess(res, data, statusCode = 200, message) {
  const payload = { data };

  if (message) {
    payload.message = message;
  }

  return res.status(statusCode).json(payload);
}

function sendPaginated(res, data, pagination, statusCode = 200) {
  return res.status(statusCode).json({ data, pagination });
}

module.exports = { sendSuccess, sendPaginated };
