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
}

export const UserSchema = SchemaFactory.createForClass(User);
