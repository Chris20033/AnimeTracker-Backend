const { prisma } = require('../config/database');

function createPasswordResetToken(data) {
  return prisma.passwordResetToken.create({ data });
}

function findPasswordResetToken(token) {
  return prisma.passwordResetToken.findUnique({ where: { token } });
}

function markPasswordResetTokenAsUsed(id) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

module.exports = {
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenAsUsed,
};
