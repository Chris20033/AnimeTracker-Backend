const { ERROR_CODES } = require('../constants/errorCodes');
const userRepository = require('../repositories/user.repository');
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

function serializePublicProfile(user) {
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    favorites: [],
    statistics: {
      totalAnime: 0,
      completedAnime: 0,
      totalEpisodesWatched: 0,
      averageScore: null,
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

async function updateMe(userId, input) {
  if (input.username) {
    const existingUser = await userRepository.findUserByUsername(input.username);

    if (existingUser && existingUser.id !== userId) {
      throw new AppError('Username already exists', 409, ERROR_CODES.USERNAME_ALREADY_EXISTS);
    }
  }

  const user = await userRepository.updateUserProfile(userId, input);

  return serializeEditableProfile(user);
}

async function getPublicProfile(username) {
  const user = await userRepository.findUserByUsername(username);

  if (!user || !user.isActive) {
    throw new AppError('User not found', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  return serializePublicProfile(user);
}

module.exports = { getMe, updateMe, getPublicProfile };
