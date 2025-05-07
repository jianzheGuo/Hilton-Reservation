import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Types } from "mongoose";

@Schema()
@ObjectType()
export class User {
  @Prop({ type: Types.ObjectId })
  @Field()
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  password: string;

  @Prop({ required: true })
  @Field()
  phone_number: string;

  @Prop({ required: true })
  @Field()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
