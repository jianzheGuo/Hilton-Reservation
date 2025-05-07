import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ParentReserveType {
  @Field(() => ID)
  _id: string;

  @Field()
  guest_name: string;

  @Field()
  guest_phone: string;

  @Field()
  guest_email: string;

  @Field()
  table_size: number;

  @Field()
  expected_arrive_time: Date;

  @Field()
  created_user: string;
}
