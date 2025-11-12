import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
  }),
});

const verify2FASchema = z.object({
  body: z.object({
    userId: z.string().uuid('ID utilisateur invalide'),
    token: z.string().length(6, 'Code 2FA invalide'),
  }),
});

const tokenSchema = z.object({
  body: z.object({
    token: z.string().length(6, 'Code invalide'),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token de rafraîchissement requis'),
  }),
});

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/verify-2fa', validate(verify2FASchema), authController.verify2FA);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', validate(refreshTokenSchema), authController.logout);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/2fa/enable', authenticateToken, authController.enable2FA);
router.post('/2fa/confirm', authenticateToken, validate(tokenSchema), authController.confirm2FA);
router.post('/2fa/disable', authenticateToken, validate(tokenSchema), authController.disable2FA);

export default router;
