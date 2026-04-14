import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getMyPaymentMethods(userId: number) {
    return this.prisma.paymentMethod.findMany({ where: { userId } });
  }

  // For checkout: return all payment methods (any user can use Admin's methods)
  async getAllPaymentMethods() {
    return this.prisma.paymentMethod.findMany({
      include: { user: { select: { name: true, role: true } } },
    });
  }

  async addPaymentMethod(userId: number, type: string, last4: string, holderName: string) {
    return this.prisma.paymentMethod.create({
      data: { userId, type, last4, holderName },
    });
  }

  async updatePaymentMethod(id: number, userId: number, type: string, last4: string, holderName: string) {
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.userId !== userId) throw new ForbiddenException('Not your payment method');
    return this.prisma.paymentMethod.update({ where: { id }, data: { type, last4, holderName } });
  }

  async deletePaymentMethod(id: number, userId: number) {
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.userId !== userId) throw new ForbiddenException('Not your payment method');
    return this.prisma.paymentMethod.delete({ where: { id } });
  }
}
