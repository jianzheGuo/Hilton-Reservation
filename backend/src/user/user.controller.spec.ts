import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { CreateUserDto } from "./dto/create-user.dto";

const moduleMocker = new ModuleMocker(global);

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token) => {
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe("createUser", () => {
    it("should return created user with data wrapper when success", async () => {
      const createUserDto: CreateUserDto = {
        username: "testuser",
        phone: "13800138000",
        email: "test@example.com",
        password: "Test@1234",
      };

      const mockResult = {
        data: {
          id: "user123",
          username: "testuser",
          email: "test@example.com",
          phone: "13800138000"
        }
      };

      jest.spyOn(userService, "createUser").mockResolvedValue(mockResult.data);

      const result = await controller.createUser(createUserDto);
      
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ data: mockResult.data });
    });

    it("should return error wrapper when service throws error", async () => {
      const createUserDto: CreateUserDto = {
        username: "invaliduser",
        phone: "invalid",
        email: "invalid",
        password: "short",
      };

      const mockError = new Error("Validation failed");
      
      jest.spyOn(userService, "createUser").mockRejectedValue(mockError);

      await expect(controller.createUser(createUserDto)).rejects.toThrow(mockError);
    });
  });
});