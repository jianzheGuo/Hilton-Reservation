import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../../schemas/user.schema";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("getAllUsers")
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post("createTestUser")
  createTestUser(): Promise<User> {
    return this.userService.createTestUser();
  }
}
