import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderType } from './order.type';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => OrderType)
@UseGuards(GqlAuthGuard, RolesGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [OrderType])
  async myOrders(@CurrentUser() user: any) {
    return this.ordersService.getMyOrders(user.id);
  }

  @Mutation(() => OrderType)
  async createOrder(@CurrentUser() user: any) {
    return this.ordersService.createOrder(user.id);
  }

  @Mutation(() => OrderType)
  async addItemToOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('menuItemId', { type: () => Int }) menuItemId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.addItemToOrder(orderId, menuItemId, quantity, user.id);
  }

  @Mutation(() => OrderType)
  @Roles('ADMIN', 'MANAGER')
  async placeOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('paymentMethodId', { type: () => Int }) paymentMethodId: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.placeOrder(orderId, paymentMethodId, user.id);
  }

  @Mutation(() => OrderType)
  @Roles('ADMIN', 'MANAGER')
  async cancelOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.cancelOrder(orderId, user.id, user.role);
  }
}
