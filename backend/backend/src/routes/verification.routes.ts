import { Router } from 'express';
import verificationController from '../controllers/verification.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

const createVerificationSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('ID propriété invalide'),
    guestFirstName: z.string().min(1, 'Prénom requis'),
    guestLastName: z.string().min(1, 'Nom requis'),
    guestEmail: z.string().email('Email invalide'),
    guestPhone: z.string().optional(),
    documentType: z.enum(['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'OTHER']),
  }),
});

const uploadDocumentSchema = z.object({
  body: z.object({
    documentFrontImage: z.string().optional(),
    documentBackImage: z.string().optional(),
    documentNumber: z.string().optional(),
    documentIssuedDate: z.string().datetime().optional(),
    documentExpiryDate: z.string().datetime().optional(),
    documentIssuedCountry: z.string().optional(),
  }),
});

const processAISchema = z.object({
  body: z.object({
    documentImageBase64: z.string().min(1, 'Image requise'),
  }),
});

const uploadSelfieSchema = z.object({
  body: z.object({
    selfieImageBase64: z.string().min(1, 'Selfie requise'),
  }),
});

router.post('/', validate(createVerificationSchema), verificationController.create);
router.get('/', verificationController.getAll);
router.get('/:id', verificationController.getOne);
router.post('/:id/document', validate(uploadDocumentSchema), verificationController.uploadDocument);
router.post('/:id/process-ai', validate(processAISchema), verificationController.processWithAI);
router.post('/:id/selfie', validate(uploadSelfieSchema), verificationController.uploadSelfie);
router.post('/:id/complete', verificationController.complete);

export default router;
