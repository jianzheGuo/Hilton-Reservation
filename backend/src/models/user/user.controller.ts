import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../../schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { logError } from "../../../error_handler/winston";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("getAllUsers")
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post("createUser")
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<
    | { data: { id: string; username: string; email: string; phone: string } }
    | { error: string }
  > {
    try {
      const user = await this.userService.createUser(createUserDto);
      return { data: user };
    } catch (e) {
      logError(e);
      return { error: e?.message || "create user failed" };
    }
  }
}
