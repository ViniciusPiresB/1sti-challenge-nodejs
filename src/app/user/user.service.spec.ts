import { PrismaService } from "../../database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Status, User } from "@prisma/client";

describe("UserService", () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const fakeUsers: User[] = [
    {
      id: "a3718843-5456-4482-9c97-a20f78cbd44e",
      cpf: "70031242546",
      name: "Test User 1",
      birth: new Date(),
      addressId: 1,
      status: Status.ACTIVE,
      createdAt: new Date(),
      createdBy: "Admin",
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
      deletedBy: undefined
    },
    {
      id: "a3718843-5456-4482-9c97-a20f78cbd45t",
      cpf: "70031242547",
      name: "Test User 2",
      birth: new Date(),
      addressId: 2,
      status: Status.ACTIVE,
      createdAt: new Date(),
      createdBy: "Admin",
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
      deletedBy: undefined
    },
    {
      id: "a3718843-5456-4482-9c97-a20f78cbd48o",
      cpf: "70031242548",
      name: "Test User 3",
      birth: new Date(),
      addressId: 3,
      status: Status.ACTIVE,
      createdAt: new Date(),
      createdBy: "Admin",
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
      deletedBy: undefined
    }
  ];

  const updatedFakeUser: User = {
    id: "a3718843-5456-4482-9c97-a20f78cbd44e",
    cpf: "70031242546",
    name: "Updated Test User",
    birth: new Date(),
    addressId: 1,
    status: Status.ACTIVE,
    createdAt: new Date(),
    createdBy: "Admin",
    updatedAt: new Date(),
    updatedBy: "Admin",
    deletedAt: undefined,
    deletedBy: undefined
  };

  const deletedFakeUser: User = {
    id: "a3718843-5456-4482-9c97-a20f78cbd44e",
    cpf: "70031242546",
    name: "Deleted Test User",
    birth: new Date(),
    addressId: 1,
    status: Status.DELETED,
    createdAt: new Date(),
    createdBy: "Admin",
    updatedAt: new Date(),
    updatedBy: "Admin",
    deletedAt: new Date(),
    deletedBy: "Admin"
  };

  const prismaMock = {
    user: {
      create: jest.fn().mockReturnValue(fakeUsers[0]),
      findMany: jest.fn().mockResolvedValue(fakeUsers),
      findFirst: jest.fn().mockResolvedValue(fakeUsers[0]),
      update: jest.fn().mockReturnValue(updatedFakeUser),
      delete: jest.fn().mockResolvedValue(deletedFakeUser)
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prismaMock }]
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    prismaMock.user.create.mockClear();
    prismaMock.user.findMany.mockClear();
    prismaMock.user.findFirst.mockClear();
    prismaMock.user.update.mockClear();
    prismaMock.user.delete.mockClear();
  });

  it("Should be defined", () => {
    expect(userService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe("create", () => {
    it("Should create an user successfully", async () => {
      const userToBeCreated: UserCreateDTO = {
        cpf: "70031242546",
        name: "Test User 1",
        birth: new Date(),
        address: {
          street: "Rua 4",
          number: "4",
          district: "Boa Vista",
          city: "São Paulo",
          state: "SP",
          cep: "01046851"
        },
        status: "ACTIVE",
        createdBy: "Admin"
      };

      const user = await userService.create(userToBeCreated);

      expect(user.id).toBeDefined();
      expect(user.cpf).toEqual(userToBeCreated.cpf);
      expect(user.name).toEqual(userToBeCreated.name);
      expect(user.birth).toBeInstanceOf(Date);
      expect(user.status).toEqual(Status.ACTIVE);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });
});
