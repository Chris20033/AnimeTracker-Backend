const { ERROR_CODES } = require('../constants/errorCodes');
const favoriteService = require('./favorite.service');
const statisticsService = require('./statistics.service');
const userRepository = require('../repositories/user.repository');
const { uploadAvatar, uploadBanner } = require('./cloudinary.service');
const { AppError } = require('../utils/AppError');

function serializePrivateProfile(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    createdAt: user.createdAt,
  };
}

function serializeEditableProfile(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
  };
}

function serializePublicProfile(user, favorites = [], statistics = null) {
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    favorites,
    statistics: statistics || {
      totalAnime: 0,
      completedAnime: 0,
      totalEpisodesWatched: 0,
      averageScore: null,
      topGenres: [],
      statusDistribution: {
        WATCHING: 0,
        COMPLETED: 0,
        ON_HOLD: 0,
        DROPPED: 0,
        PLAN_TO_WATCH: 0,
      },
    },
  };
}

async function getMe(userId) {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  return serializePrivateProfile(user);
}

async function updateMe(userId, input, files = {}) {
  const currentUser = await userRepository.findUserById(userId);

  if (!currentUser) {
    throw new AppError('User not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  const { avatar, banner, ...profileInput } = input;
  const data = { ...profileInput };

  if (profileInput.username) {
    const nextUsername = profileInput.username.trim();
    const usernameChanged = nextUsername.toLowerCase() !== currentUser.username.toLowerCase();

    if (usernameChanged) {
      const existingUser = await userRepository.findUserByUsername(nextUsername);

      if (existingUser && existingUser.id !== userId) {
        throw new AppError('Username already exists', 409, ERROR_CODES.USERNAME_ALREADY_EXISTS);
      }
    }

    data.username = nextUsername;
  }

  const avatarFile = files.avatar?.[0];
  const bannerFile = files.banner?.[0];

  if (avatarFile) {
    data.avatarUrl = await uploadAvatar(avatarFile, userId);
  }

  if (bannerFile) {
    data.bannerUrl = await uploadBanner(bannerFile, userId);
  }

  const user = await userRepository.updateUserProfile(userId, data);

  return serializeEditableProfile(user);
}

async function getPublicProfile(username) {
  const user = await userRepository.findUserByUsername(username);

  if (!user || !user.isActive) {
    throw new AppError('User not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  const favorites = await favoriteService.getPublicFavorites(user.id);
  const statistics = await statisticsService.getStatisticsForUserId(user.id);

  return serializePublicProfile(user, favorites, statistics);
}

module.exports = { getMe, updateMe, getPublicProfile };
