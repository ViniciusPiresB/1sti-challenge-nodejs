import { Status } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  const fakeUsersDTO: UserDTO[] = [
    {
      id: Date.now().toString(),
      cpf: "12345678910",
      name: "Fake name 1",
      typeUser: 0,
      birth: new Date(),
      status: Status.ACTIVE
    },
    {
      id: Date.now().toString(),
      cpf: "12345678911",
      name: "Fake name 2",
      typeUser: 0,
      birth: new Date(),
      status: Status.ACTIVE
    },
    {
      id: Date.now().toString(),
      cpf: "12345678912",
      name: "Fake name 3",
      typeUser: 0,
      birth: new Date(),
      status: Status.ACTIVE
    }
  ];

  const userServiceMock = {
    create: jest.fn((userCreateDTO) => {
      return { id: Date.now(), ...userCreateDTO };
    }),
    findAll: jest.fn().mockResolvedValue(fakeUsersDTO),
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
        password: "1234",
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
      expect(userServiceMock.create).toHaveBeenCalledWith(fakeUserCreateDTO);
      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("Should list all users", async () => {
      const result = await userController.findAll();

      expect(result).toEqual(fakeUsersDTO);
      expect(userServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("Should return a user", async () => {
      const cpf = fakeUsersDTO[0].cpf;

      const result = await userController.findOne(cpf);

      expect(result).toEqual({ ...fakeUsersDTO[0], cpf });
      expect(userServiceMock.findOne).toHaveBeenCalledWith(cpf);
      expect(userServiceMock.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateUser", () => {
    it("Should update a user", async () => {
      const cpf = fakeUsersDTO[0].cpf;

      const userUpdateDTO: UserUpdateDTO = {
        name: "Updated User",
        birth: new Date(),
        updatedBy: "Admin"
      };

      const result = await userController.update(cpf, userUpdateDTO);

      expect(result).toEqual({ ...fakeUsersDTO[0], ...userUpdateDTO });
      expect(userServiceMock.updateUser).toHaveBeenCalledWith(
        cpf,
        userUpdateDTO
      );
      expect(userServiceMock.updateUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("Should remove a user", async () => {
      const cpf = fakeUsersDTO[0].cpf;

      const result = await userController.remove(cpf);

      expect(result).toEqual({ ...fakeUsersDTO[0], status: Status.DELETED });
      expect(userServiceMock.remove).toHaveBeenCalledWith(cpf);
      expect(userServiceMock.remove).toHaveBeenCalledTimes(1);
    });
  });
});
