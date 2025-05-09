import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";

const moduleMocker = new ModuleMocker(global);

describe("UserService", () => {
  let service: UserService;
  let userModel: Model<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === getModelToken("User")) {
          return {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<any>>(getModelToken("User"));
  });

  describe("getUserByPhone", () => {
    it("should find user by phone number", async () => {
      const mockUser = {
        _id: "123",
        name: "test user",
        phone_number: "13800138000",
        email: "test@example.com",
        password: "password123",
        role: "user",
      };

      const mockFindOneQuery = {
        exec: jest.fn().mockResolvedValue(mockUser)
      };
      jest.spyOn(userModel, "findOne").mockReturnValue(mockFindOneQuery as any);

      const result = await service.getUserByPhone("13800138000");

      expect(userModel.findOne).toHaveBeenCalledWith({
        phone_number: "13800138000",
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user does not exist", async () => {
      const mockFindOneQuery = {
        exec: jest.fn().mockResolvedValue(null)
      };
      jest.spyOn(userModel, "findOne").mockReturnValue(mockFindOneQuery as any);

      const result = await service.getUserByPhone("nonexistent");

      expect(userModel.findOne).toHaveBeenCalledWith({
        phone_number: "nonexistent",
      });
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should return new user", async () => {
      const createUserDto = {
        username: "new user",
        phone: "13900139000",
        email: "new@example.com",
        password: "newpass123",
      };

      const mockCreatedUser = {
        _id: "new123",
        name: "new user",
        phone_number: "13900139000",
        email: "new@example.com",
      };

      jest.spyOn(userModel, "create").mockResolvedValue([{
        ...mockCreatedUser,
        save: jest.fn()
      }]);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual({
        id: "new123",
        username: "new user",
        email: "new@example.com",
        phone: "13900139000"
      });
    });
  });
});
