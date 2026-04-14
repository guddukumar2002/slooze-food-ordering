import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService implements OnModuleInit {
  private client: PrismaClient;

  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
    this.client = new PrismaClient({ adapter } as any);
  }

  get user() { return this.client.user; }
  get restaurant() { return this.client.restaurant; }
  get menuItem() { return this.client.menuItem; }
  get order() { return this.client.order; }
  get orderItem() { return this.client.orderItem; }
  get paymentMethod() { return this.client.paymentMethod; }

  async onModuleInit() {
    await this.client.$connect();
  }
}
