import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

const moduleMocker = new ModuleMocker(global);

describe("AuthService", () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
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

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signIn", () => {
    it("should return token when credential is provided correctly", async () => {
      const mockUser = {
        _id: "user123",
        name: "test user",
        phone_number: "09876543211",
        email: "test@example.com",
        password: "12345678qweASD",
        role: "user",
      };

      const mockToken = "mock.jwt.token";

      jest.spyOn(userService, "getUserByPhone").mockResolvedValue(mockUser);
      jest.spyOn(jwtService, "signAsync").mockResolvedValue(mockToken);

      const result = await service.signIn("09876543211", "12345678qweASD");

      expect(result).toEqual({
        id: mockUser._id.toString(),
        username: mockUser.name,
        phone: mockUser.phone_number,
        email: mockUser.email,
        role: mockUser.role,
        access_token: mockToken,
      });

      expect(userService.getUserByPhone).toHaveBeenCalledWith("09876543211");
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id.toString(),
        username: mockUser.name,
        phone: mockUser.phone_number,
        email: mockUser.email,
      });
    });

    it("should throw error when user does not exist", async () => {
      jest.spyOn(userService, "getUserByPhone").mockResolvedValue(null);

      await expect(service.signIn("nonexistent", "password")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should thorw error when password does not match", async () => {
      const mockUser = {
        _id: "user123",
        name: "test user",
        phone_number: "09876543211",
        email: "test@example.com",
        password: "correctPassword",
        role: "user",
      };

      jest.spyOn(userService, "getUserByPhone").mockResolvedValue(mockUser);

      await expect(
        service.signIn("09876543211", "wrongPassword"),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("show throw error when db connection error", async () => {
      const dbError = new Error("db connection error");
      jest.spyOn(userService, "getUserByPhone").mockRejectedValue(dbError);

      await expect(service.signIn("09876543211", "password")).rejects.toThrow(
        dbError,
      );
    });
  });
});
