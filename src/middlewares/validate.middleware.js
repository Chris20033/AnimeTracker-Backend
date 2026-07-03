const { ERROR_CODES } = require('../constants/errorCodes');
const { AppError } = require('../utils/AppError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(new AppError('Invalid request data', 400, ERROR_CODES.VALIDATION_ERROR, details));
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };
