import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(country: string) {
    // ADMIN (country=ALL) sees everything; others see only their country
    const where = country === 'ALL' ? {} : { country };
    return this.prisma.restaurant.findMany({
      where,
      include: { menuItems: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
  }
}
