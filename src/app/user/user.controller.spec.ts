import { Status } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserCreateDTO } from "./dto/user-create.dto";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  const fakeUsersDTO: UserDTO[] = [
    {
      id: Date.now().toString(),
      cpf: "12345678910",
      name: "Fake name 1",
      birth: new Date(),
      status: Status.ACTIVE
    },
    {
      id: Date.now().toString(),
      cpf: "12345678911",
      name: "Fake name 2",
      birth: new Date(),
      status: Status.ACTIVE
    },
    {
      id: Date.now().toString(),
      cpf: "12345678912",
      name: "Fake name 3",
      birth: new Date(),
      status: Status.ACTIVE
    }
  ];

  const userServiceMock = {
    create: jest.fn((userCreateDTO) => {
      return { id: Date.now(), ...userCreateDTO };
    }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn((cpf) => {
      return { ...fakeUsersDTO[0], cpf };
    }),
    updateUser: jest.fn((cpf, dto) => {
      return { ...fakeUsersDTO[0], ...dto };
    }),
    remove: jest.fn((cpf) => {
      return { ...fakeUsersDTO[0], status: Status.DELETED };
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

  describe("create", () => {
    it("Should create a user", async () => {
      const fakeUserCreateDTO: UserCreateDTO = {
        ...fakeUsersDTO[0],
        createdBy: "Admin",
        address: {
          street: "Rua 1",
          number: "2",
          district: "Boa Vista",
          city: "São Paulo",
          state: "SP",
          cep: "01293404"
        }
      };

      const result = await userController.create(fakeUserCreateDTO);

      expect(result).toEqual({ id: expect.any(String), ...fakeUserCreateDTO });
      expect(userService.create).toHaveBeenCalledWith(fakeUserCreateDTO);
    });
  });
});