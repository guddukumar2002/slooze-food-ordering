import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOrder(userId: number) {
    return this.prisma.order.create({
      data: { userId, status: 'PENDING', totalAmount: 0 },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async addItemToOrder(orderId: number, menuItemId: number, quantity: number, userId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    if (order.status !== 'PENDING') throw new ForbiddenException('Order already placed or cancelled');

    const menuItem = await this.prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (!menuItem) throw new NotFoundException('Menu item not found');

    await this.prisma.orderItem.create({
      data: { orderId, menuItemId, quantity, price: menuItem.price },
    });

    // recalculate total
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: total },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async placeOrder(orderId: number, paymentMethodId: number, userId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    if (order.status !== 'PENDING') throw new ForbiddenException('Order already placed or cancelled');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PLACED', paymentMethodId },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async cancelOrder(orderId: number, userId: number, userRole: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    // Admin can cancel any order; Manager/Member can only cancel their own
    if (userRole !== 'ADMIN' && order.userId !== userId) {
      throw new ForbiddenException('Not your order');
    }
    if (order.status === 'CANCELLED') throw new ForbiddenException('Already cancelled');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: { include: { menuItem: true } } },
    });
  }
}
