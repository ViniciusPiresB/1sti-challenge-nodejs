import { Status } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  const fakeUserDTO: UserDTO = {
    id: Date.now().toString(),
    cpf: "12345678910",
    name: "Fake name",
    birth: new Date(),
    status: Status.ACTIVE
  };

  const userServiceMock = {
    create: jest.fn((userCreateDTO) => {
      return { id: Date.now(), ...userCreateDTO };
    }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn((cpf) => {
      return { ...fakeUserDTO, cpf };
    }),
    updateUser: jest.fn((cpf, dto) => {
      return { ...fakeUserDTO, ...dto };
    }),
    remove: jest.fn((cpf) => {
      return { ...fakeUserDTO, status: Status.DELETED };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    userServiceMock.create.mockClear();
    userServiceMock.findAll.mockClear();
    userServiceMock.findOne.mockClear();
    userServiceMock.updateUser.mockClear();
    userServiceMock.remove.mockClear();
  });

  it("Should be defined", () => {
    expect(userController).toBeDefined();
  });
});
