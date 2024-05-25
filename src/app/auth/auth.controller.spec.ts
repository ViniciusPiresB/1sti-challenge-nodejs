import { Address, Status } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

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
});
