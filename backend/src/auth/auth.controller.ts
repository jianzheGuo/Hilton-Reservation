import { Controller, Body, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    try {
      return this.authService.signIn(signInDto.phone, signInDto.password);
    } catch (error) {
      return { error: error?.message || "Sign in failed" };
    }
  }
}
