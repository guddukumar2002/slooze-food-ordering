import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItemType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class RestaurantType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  cuisine: string;

  @Field()
  country: string;

  @Field()
  imageUrl: string;

  @Field(() => [MenuItemType])
  menuItems: MenuItemType[];
}
