import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class SignInDto {
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  password: string;
}
