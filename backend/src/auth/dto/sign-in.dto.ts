import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
