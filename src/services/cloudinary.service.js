const { cloudinary } = require('../config/cloudinary');

function uploadImage(file, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result.secure_url);
    });

    uploadStream.end(file.buffer);
  });
}

function uploadAvatar(file, userId) {
  return uploadImage(file, {
    folder: 'animetracker/users/avatars',
    public_id: userId,
    overwrite: true,
    resource_type: 'image',
    transformation: [
      { width: 512, height: 512, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
}

function uploadBanner(file, userId) {
  return uploadImage(file, {
    folder: 'animetracker/users/banners',
    public_id: userId,
    overwrite: true,
    resource_type: 'image',
    transformation: [
      { width: 1600, height: 500, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
}

module.exports = { uploadAvatar, uploadBanner };
