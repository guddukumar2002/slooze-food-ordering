import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaymentOwner {
  @Field() name: string;
  @Field() role: string;
}

@ObjectType()
export class PaymentMethodType {
  @Field(() => Int) id: number;
  @Field() type: string;
  @Field() last4: string;
  @Field() holderName: string;
  @Field(() => Int) userId: number;
  @Field(() => PaymentOwner, { nullable: true }) user?: PaymentOwner;
}
