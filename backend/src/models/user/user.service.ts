import { Injectable } from "@nestjs/common";
import { User } from "../../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getUsers(): Promise<User[]> {
    // return "Hello World!";
    return this.userModel.find().then((res) => {
      console.log(res);
      return res;
    });
  }
  createTestUser(): Promise<User> {
    return this.userModel.create({
      name: "Test User",
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(new Types.ObjectId(id)).exec();
  }
}
