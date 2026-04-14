import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { MenuItemType } from '../restaurants/restaurant.type';

@ObjectType()
export class OrderItemType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => MenuItemType)
  menuItem: MenuItemType;
}

@ObjectType()
export class OrderType {
  @Field(() => Int)
  id: number;

  @Field()
  status: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Int)
  userId: number;

  @Field(() => [OrderItemType])
  items: OrderItemType[];

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  paymentMethodId?: number;
}
