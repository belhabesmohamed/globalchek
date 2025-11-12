import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { VerificationStatus, DocumentType } from '@prisma/client';
import aiService from './ai.service';
import logger from '../config/logger';

export class VerificationService {
  async createVerification(userId: string, data: {
    propertyId: string;
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
    guestPhone?: string;
    documentType: DocumentType;
  }) {
    // Verify property belongs to user
    const property = await prisma.property.findFirst({
      where: { id: data.propertyId, userId },
    });

    if (!property) {
      throw new AppError('Propriété non trouvée', 404);
    }

    const verification = await prisma.verification.create({
      data: {
        ...data,
        userId,
        status: VerificationStatus.PENDING,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Nouvelle vérification',
        message: `Nouvelle demande de vérification pour ${data.guestFirstName} ${data.guestLastName}`,
        type: 'info',
      },
    });

    return verification;
  }

  async uploadDocument(verificationId: string, userId: string, documentData: {
    documentFrontImage?: string;
    documentBackImage?: string;
    documentNumber?: string;
    documentIssuedDate?: Date;
    documentExpiryDate?: Date;
    documentIssuedCountry?: string;
  }) {
    const verification = await prisma.verification.findFirst({
      where: { id: verificationId, userId },
    });

    if (!verification) {
      throw new AppError('Vérification non trouvée', 404);
    }

    const updated = await prisma.verification.update({
      where: { id: verificationId },
      data: {
        ...documentData,
        status: VerificationStatus.IN_PROGRESS,
      },
    });

    return updated;
  }

  async processDocumentWithAI(verificationId: string, userId: string, documentImageBase64: string) {
    const verification = await prisma.verification.findFirst({
      where: { id: verificationId, userId },
    });

    if (!verification) {
      throw new AppError('Vérification non trouvée', 404);
    }

    try {
      // Extract OCR data
      const ocrData = await aiService.extractDocumentData(
        documentImageBase64,
        verification.documentType
      );

      // Detect fraud
      const fraudAnalysis = await aiService.detectFraud(documentImageBase64, ocrData);

      // Update verification with AI results
      const updated = await prisma.verification.update({
        where: { id: verificationId },
        data: {
          ocrData: ocrData as any,
          fraudScore: fraudAnalysis.fraudScore,
          aiNotes: fraudAnalysis.explanation,
          documentNumber: ocrData.documentNumber || verification.documentNumber,
          documentIssuedDate: ocrData.issuedDate ? new Date(ocrData.issuedDate) : verification.documentIssuedDate,
          documentExpiryDate: ocrData.expiryDate ? new Date(ocrData.expiryDate) : verification.documentExpiryDate,
          documentIssuedCountry: ocrData.issuingCountry || verification.documentIssuedCountry,
          guestNationality: ocrData.nationality || verification.guestNationality,
        },
      });

      // Create notification based on fraud score
      if (fraudAnalysis.fraudScore > 70) {
        await prisma.notification.create({
          data: {
            userId,
            title: 'Alerte fraude',
            message: `Score de fraude élevé (${fraudAnalysis.fraudScore}%) pour ${verification.guestFirstName} ${verification.guestLastName}`,
            type: 'error',
          },
        });
      }

      return {
        verification: updated,
        ocrData,
        fraudAnalysis,
      };
    } catch (error: any) {
      logger.error('AI processing failed:', error);
      throw new AppError(`Erreur de traitement IA: ${error.message}`, 500);
    }
  }

  async uploadSelfie(verificationId: string, userId: string, selfieImageBase64: string) {
    const verification = await prisma.verification.findFirst({
      where: { id: verificationId, userId },
      select: {
        id: true,
        documentFrontImage: true,
        guestFirstName: true,
        guestLastName: true,
      },
    });

    if (!verification) {
      throw new AppError('Vérification non trouvée', 404);
    }

    if (!verification.documentFrontImage) {
      throw new AppError('Document non encore uploadé', 400);
    }

    try {
      // For demo, we'll store the base64. In production, upload to S3/cloud storage
      const selfieUrl = `data:image/jpeg;base64,${selfieImageBase64.substring(0, 50)}...`;

      // Compare faces using AI
      const faceComparison = await aiService.compareFaces(
        verification.documentFrontImage,
        selfieImageBase64
      );

      // Update verification
      const updated = await prisma.verification.update({
        where: { id: verificationId },
        data: {
          selfieImage: selfieUrl,
          faceMatchScore: faceComparison.matchScore,
          livenessScore: 95, // Mock liveness score
        },
      });

      return {
        verification: updated,
        faceComparison,
      };
    } catch (error: any) {
      logger.error('Selfie processing failed:', error);
      throw new AppError(`Erreur de traitement selfie: ${error.message}`, 500);
    }
  }

  async completeVerification(verificationId: string, userId: string) {
    const verification = await prisma.verification.findFirst({
      where: { id: verificationId, userId },
    });

    if (!verification) {
      throw new AppError('Vérification non trouvée', 404);
    }

    // Check if all required steps are completed
    if (!verification.documentFrontImage || !verification.selfieImage) {
      throw new AppError('Vérification incomplète', 400);
    }

    // Determine status based on fraud and face match scores
    let status = VerificationStatus.COMPLETED;
    let rejectionReason = null;

    if (verification.fraudScore && verification.fraudScore > 70) {
      status = VerificationStatus.REJECTED;
      rejectionReason = 'Score de fraude élevé détecté';
    } else if (verification.faceMatchScore && verification.faceMatchScore < 85) {
      status = VerificationStatus.REJECTED;
      rejectionReason = 'Visage ne correspond pas au document';
    }

    const updated = await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status,
        rejectionReason,
        verifiedAt: status === VerificationStatus.COMPLETED ? new Date() : null,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: status === VerificationStatus.COMPLETED ? 'Vérification réussie' : 'Vérification rejetée',
        message: `Vérification de ${verification.guestFirstName} ${verification.guestLastName} - ${status}`,
        type: status === VerificationStatus.COMPLETED ? 'success' : 'warning',
      },
    });

    return updated;
  }

  async getVerifications(userId: string, filters?: {
    propertyId?: string;
    status?: VerificationStatus;
  }) {
    const where: any = { userId };

    if (filters?.propertyId) {
      where.propertyId = filters.propertyId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const verifications = await prisma.verification.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return verifications;
  }

  async getVerification(id: string, userId: string) {
    const verification = await prisma.verification.findFirst({
      where: { id, userId },
      include: {
        property: true,
        contract: true,
      },
    });

    if (!verification) {
      throw new AppError('Vérification non trouvée', 404);
    }

    return verification;
  }
}

export default new VerificationService();
