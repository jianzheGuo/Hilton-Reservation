import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class CancelReserveType {
  @Field(() => ID)
  _id: string;

  @Field()
  status: string;
}
