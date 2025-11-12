import { Router } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import verificationRoutes from './verification.routes';

const router = Router();

// API Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GlobalChek API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/verifications', verificationRoutes);

export default router;
