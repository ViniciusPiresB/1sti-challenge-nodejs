import { Address, Status } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const authServiceMock = {
    validate: jest.fn().mockReturnValue({ accessToken: "fake token" })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    authServiceMock.validate.mockClear();
  });

  it("Should be defined", () => {
    expect(authController).toBeDefined();
  });

  describe("login", () => {
    it("Should return token", async () => {
      const loginDto: LoginDto = {
        cpf: "12345678910",
        password: "password"
      };

      const result = await authController.login(loginDto);

      expect(result).toEqual({ accessToken: "fake token" });
      expect(authServiceMock.validate).toHaveBeenCalledWith(loginDto);
      expect(authServiceMock.validate).toHaveBeenCalledTimes(1);
    });
  });
});
