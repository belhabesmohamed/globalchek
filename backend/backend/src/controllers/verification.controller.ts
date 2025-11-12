import { Response, NextFunction } from 'express';
import verificationService from '../services/verification.service';
import { AuthRequest } from '../middleware/auth';

export class VerificationController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const verification = await verificationService.createVerification(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Vérification créée avec succès',
        data: verification,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const verification = await verificationService.uploadDocument(id, userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Document uploadé avec succès',
        data: verification,
      });
    } catch (error) {
      next(error);
    }
  }

  async processWithAI(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { documentImageBase64 } = req.body;

      const result = await verificationService.processDocumentWithAI(id, userId, documentImageBase64);

      res.status(200).json({
        success: true,
        message: 'Document traité avec succès',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadSelfie(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { selfieImageBase64 } = req.body;

      const result = await verificationService.uploadSelfie(id, userId, selfieImageBase64);

      res.status(200).json({
        success: true,
        message: 'Selfie uploadé et traité avec succès',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const verification = await verificationService.completeVerification(id, userId);

      res.status(200).json({
        success: true,
        message: 'Vérification complétée',
        data: verification,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { propertyId, status } = req.query;

      const verifications = await verificationService.getVerifications(userId, {
        propertyId: propertyId as string,
        status: status as any,
      });

      res.status(200).json({
        success: true,
        data: verifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const verification = await verificationService.getVerification(id, userId);

      res.status(200).json({
        success: true,
        data: verification,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VerificationController();
