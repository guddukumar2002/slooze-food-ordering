import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentMethodType } from './payment.type';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => PaymentMethodType)
@UseGuards(GqlAuthGuard, RolesGuard)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query(() => [PaymentMethodType])
  async myPaymentMethods(@CurrentUser() user: any) {
    return this.paymentsService.getMyPaymentMethods(user.id);
  }

  // All payment methods — for checkout (any logged-in user can see)
  @Query(() => [PaymentMethodType])
  async allPaymentMethods() {
    return this.paymentsService.getAllPaymentMethods();
  }

  @Mutation(() => PaymentMethodType)
  @Roles('ADMIN')
  async addPaymentMethod(
    @Args('type') type: string,
    @Args('last4') last4: string,
    @Args('holderName') holderName: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.addPaymentMethod(user.id, type, last4, holderName);
  }

  @Mutation(() => PaymentMethodType)
  @Roles('ADMIN')
  async updatePaymentMethod(
    @Args('id', { type: () => Int }) id: number,
    @Args('type') type: string,
    @Args('last4') last4: string,
    @Args('holderName') holderName: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.updatePaymentMethod(id, user.id, type, last4, holderName);
  }

  @Mutation(() => PaymentMethodType)
  @Roles('ADMIN')
  async deletePaymentMethod(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.deletePaymentMethod(id, user.id);
  }
}
