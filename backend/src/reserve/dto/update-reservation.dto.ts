import { Field, InputType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
export class UpdateReservationInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  tableSize?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  arrivalTime?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;
}
