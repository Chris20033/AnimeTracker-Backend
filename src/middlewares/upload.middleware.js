const multer = require('multer');

const { ERROR_CODES } = require('../constants/errorCodes');
const { AppError } = require('../utils/AppError');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(new AppError('Only JPEG, PNG and WebP images are allowed', 400, ERROR_CODES.VALIDATION_ERROR));
      return;
    }

    cb(null, true);
  },
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]);

function profileUploadMiddleware(req, res, next) {
  profileUpload(req, res, (error) => {
    if (error) {
      next(error);
      return;
    }

    next();
  });
}

module.exports = { profileUploadMiddleware };
