import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { UnauthorizedException } from "@nestjs/common";
// import { ValidationPipe } from "@nestjs/common";

const moduleMocker = new ModuleMocker(global);

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      // .useGlobalPipes(new ValidationPipe({ transform: true }))
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should sign in with token returned", async () => {
    const mockLoginDto = {
      phone: "09876543211",
      password: "12345678qweASD",
    };

    const mockAuthResult = {
      access_token: "mock-jwt-token",
      id: "user-123",
      username: "testuser",
      phone: "09876543211",
      email: "test@example.com",
      role: "user",
    };

    jest.spyOn(authService, "signIn").mockResolvedValue(mockAuthResult);

    const result = await controller.signIn(mockLoginDto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.signIn).toHaveBeenCalledWith(
      mockLoginDto.phone,
      mockLoginDto.password,
    );
    expect(result).toEqual(mockAuthResult);
  });

  it("should return error when login failed", async () => {
    const invalidLoginDto = {
      phone: "invalid_phone",
      password: "wrong_password",
    };

    jest
      .spyOn(authService, "signIn")
      .mockRejectedValue(new UnauthorizedException("Invalid credentials"));

    await expect(controller.signIn(invalidLoginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should handler service error", async () => {
    const mockLoginDto = {
      phone: "09876543211",
      password: "12345678qweASD",
    };

    jest
      .spyOn(authService, "signIn")
      .mockRejectedValue(new Error("Database connection failed"));

    await expect(controller.signIn(mockLoginDto)).rejects.toThrow(Error);
  });
});
