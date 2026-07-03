function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  console.log('[DEV_EMAIL] Password reset requested');
  console.log(`[DEV_EMAIL] To: ${email}`);
  console.log(`[DEV_EMAIL] Reset URL: ${resetUrl}`);
  console.log(`[DEV_EMAIL] Reset token: ${resetToken}`);
}

module.exports = { sendPasswordResetEmail };
