import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateReservationInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field()
  email: string;

  @Field()
  tableSize: number;

  @Field()
  arrivalTime: Date;

  @Field()
  createdUser: string; // 关联用户ID
}
