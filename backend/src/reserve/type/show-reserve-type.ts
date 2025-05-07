import { ObjectType, Field } from "@nestjs/graphql";
import { ParentReserveType } from "./parent-reserve-type";

@ObjectType()
export class showReserveType extends ParentReserveType {
  @Field()
  created_user_name: string;

  @Field()
  created_date: Date;

  @Field()
  updated_date: Date;

  @Field()
  updated_user: string;
}
