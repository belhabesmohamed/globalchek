import { Router } from 'express';
import propertyController from '../controllers/property.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

const createPropertySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nom requis'),
    address: z.string().min(1, 'Adresse requise'),
    city: z.string().min(1, 'Ville requise'),
    country: z.string().optional(),
    propertyType: z.string().min(1, 'Type de propriété requis'),
    capacity: z.number().int().positive('Capacité doit être positive'),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

const updatePropertySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    country: z.string().optional(),
    propertyType: z.string().min(1).optional(),
    capacity: z.number().int().positive().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

router.post('/', validate(createPropertySchema), propertyController.create);
router.get('/', propertyController.getAll);
router.get('/:id', propertyController.getOne);
router.put('/:id', validate(updatePropertySchema), propertyController.update);
router.delete('/:id', propertyController.delete);
router.get('/:id/stats', propertyController.getStats);

export default router;
