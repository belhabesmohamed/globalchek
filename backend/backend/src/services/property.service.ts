import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class PropertyService {
  async createProperty(userId: string, data: {
    name: string;
    address: string;
    city: string;
    country?: string;
    propertyType: string;
    capacity: number;
    description?: string;
    images?: string[];
  }) {
    const property = await prisma.property.create({
      data: {
        ...data,
        userId,
        country: data.country || 'Morocco',
        images: data.images || [],
      },
    });

    return property;
  }

  async getProperties(userId: string) {
    const properties = await prisma.property.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            verifications: true,
            contracts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return properties;
  }

  async getProperty(id: string, userId: string) {
    const property = await prisma.property.findFirst({
      where: { id, userId },
      include: {
        verifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            verifications: true,
            contracts: true,
          },
        },
      },
    });

    if (!property) {
      throw new AppError('Propriété non trouvée', 404);
    }

    return property;
  }

  async updateProperty(id: string, userId: string, data: any) {
    const property = await prisma.property.findFirst({
      where: { id, userId },
    });

    if (!property) {
      throw new AppError('Propriété non trouvée', 404);
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    return updated;
  }

  async deleteProperty(id: string, userId: string) {
    const property = await prisma.property.findFirst({
      where: { id, userId },
    });

    if (!property) {
      throw new AppError('Propriété non trouvée', 404);
    }

    await prisma.property.delete({
      where: { id },
    });

    return { message: 'Propriété supprimée avec succès' };
  }

  async getPropertyStats(propertyId: string, userId: string) {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, userId },
    });

    if (!property) {
      throw new AppError('Propriété non trouvée', 404);
    }

    const totalVerifications = await prisma.verification.count({
      where: { propertyId },
    });

    const completedVerifications = await prisma.verification.count({
      where: { propertyId, status: 'COMPLETED' },
    });

    const pendingVerifications = await prisma.verification.count({
      where: { propertyId, status: 'PENDING' },
    });

    const failedVerifications = await prisma.verification.count({
      where: { propertyId, status: 'FAILED' },
    });

    const recentVerifications = await prisma.verification.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        guestFirstName: true,
        guestLastName: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      totalVerifications,
      completedVerifications,
      pendingVerifications,
      failedVerifications,
      successRate: totalVerifications > 0
        ? Math.round((completedVerifications / totalVerifications) * 100)
        : 0,
      recentVerifications,
    };
  }
}

export default new PropertyService();
