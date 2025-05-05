import { Query, Resolver, Args } from "@nestjs/graphql";
import { User } from "../../schemas/user.schema";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: "user" })
  async getUser(@Args("id") id: string): Promise<User | null> {
    return await this.userService.getUserById(id);
  }
}
