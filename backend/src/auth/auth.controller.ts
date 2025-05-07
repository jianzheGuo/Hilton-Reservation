import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthGuard } from "./auth.guard";

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

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
