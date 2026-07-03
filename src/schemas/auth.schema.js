const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(30),
    email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
    password: z.string().min(8),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
    password: z.string().min(1),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

const validateResetTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateResetTokenSchema,
};
