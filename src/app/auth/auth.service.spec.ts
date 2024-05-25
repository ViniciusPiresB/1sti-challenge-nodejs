import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { Status } from "@prisma/client";
import { validatePassword } from "../utils/validate-password";
import { LoginDto } from "./dto/login.dto";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

jest.mock("../utils/validate-password");

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const fakeUserWithPassword = {
    id: "a3718843-5456-4482-9c97-a20f78cbd44e",
    cpf: "70031242546",
    password: 1234,
    name: "Test User 1",
    birth: new Date(),
    typeUser: 0,
    status: Status.ACTIVE
  };

  const mockUserService = {
    getUserWithPassword: jest.fn().mockResolvedValue(fakeUserWithPassword)
  };

  const mockJwtService = {
    sign: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("Should be defined", () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe("validate", () => {
    const loginDto: LoginDto = {
      cpf: "12345678910",
      password: "password"
    };

    const user = {
      password: "1234",
      id: "asdsa-ewrwer",
      cpf: "12345678910",
      name: "Fake User",
      birth: new Date(),
      status: Status.ACTIVE,
      typeUser: 0
    };

    it("Should return a accessToken if user is valid", async () => {
      (validatePassword as jest.Mock).mockResolvedValueOnce(true);
      mockJwtService.sign.mockReturnValueOnce("fake token");

      const result = await authService.validate(loginDto);

      expect(result).toEqual({ accessToken: "fake token" });
    });

    it("Should throw Error if password or cpf is missing", async () => {
      await expect(
        authService.validate({ ...loginDto, password: "" })
      ).rejects.toThrow(
        new BadRequestException("Missing password or cpf in request.")
      );

      await expect(
        authService.validate({ ...loginDto, cpf: "" })
      ).rejects.toThrow(
        new BadRequestException("Missing password or cpf in request.")
      );
    });

    it("Should throw Error if user is not found or password invalid", async () => {
      mockUserService.getUserWithPassword.mockResolvedValue(null);
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.validate(loginDto)).rejects.toThrow(
        new UnauthorizedException("Email or password invalid.")
      );

      mockUserService.getUserWithPassword.mockResolvedValue(user);
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.validate(loginDto)).rejects.toThrow(
        new UnauthorizedException("Email or password invalid.")
      );
    });
  });
});
