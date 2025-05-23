import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    phone: string,
    pass: string,
  ): Promise<{
    id: string;
    username: string;
    phone: string;
    email: string;
    role: string;
    access_token: string;
  }> {
    const user = await this.userService.getUserByPhone(phone);
    if (user?.password !== pass) {
      throw new UnauthorizedException({
        message: "Invalid phone or password",
        code: "AUTH_001",
      });
    }
    const payload = {
      sub: user._id.toString(),
      username: user.name,
      phone: user.phone_number,
      email: user.email,
    };
    return {
      id: user._id.toString(),
      username: user.name,
      phone: user.phone_number,
      email: user.email,
      role: user.role,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
