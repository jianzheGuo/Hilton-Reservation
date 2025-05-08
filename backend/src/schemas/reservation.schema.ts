import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Types } from "mongoose";

@Schema()
@ObjectType()
export class Reservation {
  @Prop({ type: Types.ObjectId })
  @Field()
  _id: string;

  @Prop({ required: true })
  @Field()
  guest_name: string;

  @Prop({ required: true })
  @Field()
  guest_phone: string;

  @Prop({ required: true })
  @Field()
  guest_email: string;

  @Prop({ required: true })
  @Field()
  table_size: number;

  @Prop({ required: true })
  @Field()
  expected_arrive_time: Date;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  @Field()
  created_user: string;

  @Prop({ required: true, default: Date.now })
  @Field()
  created_date: Date;

  @Field()
  updated_date: Date;

  @Field()
  updated_user: string;

  @Prop({ required: true, default: "Pending" })
  @Field()
  status: string;

  @Prop({ required: true, default: false })
  @Field()
  is_deleted: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
