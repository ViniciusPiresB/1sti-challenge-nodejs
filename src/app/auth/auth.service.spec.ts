import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { Status } from "@prisma/client";

jest.mock("../utils/validatePassword");

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
});
