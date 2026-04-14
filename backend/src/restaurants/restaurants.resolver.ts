import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantType } from './restaurant.type';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => RestaurantType)
@UseGuards(GqlAuthGuard)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  @Query(() => [RestaurantType])
  async restaurants(@CurrentUser() user: any) {
    return this.restaurantsService.findAll(user.country);
  }

  @Query(() => RestaurantType, { nullable: true })
  async restaurant(@Args('id', { type: () => Int }) id: number) {
    return this.restaurantsService.findOne(id);
  }
}
