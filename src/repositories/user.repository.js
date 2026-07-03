const { prisma } = require('../config/database');

function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

function createUser(data) {
  return prisma.user.create({ data });
}

function updateUserPassword(userId, passwordHash) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

module.exports = {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
};
