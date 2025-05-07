import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../models/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(phone: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByPhone(phone);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user._id.toString(),
      username: user.name,
      phone: user.phone_number,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
