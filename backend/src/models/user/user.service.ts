import { Injectable } from "@nestjs/common";
import { User } from "../../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";

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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create({
      name: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      phone_number: createUserDto.phone,
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(new Types.ObjectId(id)).exec();
  }
}
