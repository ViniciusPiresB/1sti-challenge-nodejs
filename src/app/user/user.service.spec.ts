import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../../database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Status, User } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("UserService", () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const fakeUsers: UserDTO[] = [
    {
      id: "a3718843-5456-4482-9c97-a20f78cbd44e",
      cpf: "70031242546",
      name: "Test User 1",
      birth: new Date(),
      status: Status.ACTIVE
    },
    {
      id: "a3718843-5456-4482-9c97-a20f78cbd45t",
      cpf: "70031242547",
      name: "Test User 2",
      birth: new Date(),
      status: Status.ACTIVE
    },
    {
      id: "a3718843-5456-4482-9c97-a20f78cbd48o",
      cpf: "70031242548",
      name: "Test User 3",
      birth: new Date(),
      status: Status.ACTIVE
    }
  ];

  const updatedFakeUser: UserDTO = {
    id: "a3718843-5456-4482-9c97-a20f78cbd44e",
    cpf: "70031242546",
    name: "Updated Test User",
    birth: new Date(),
    status: Status.ACTIVE
  };

  const deletedFakeUser: UserDTO = {
    id: "a3718843-5456-4482-9c97-a20f78cbd44e",
    cpf: "70031242546",
    name: "Deleted Test User",
    birth: new Date(),
    status: Status.DELETED
  };

  const prismaMock = {
    user: {
      create: jest.fn().mockReturnValue(fakeUsers[0]),
      findMany: jest.fn().mockResolvedValue(fakeUsers),
      findFirst: jest.fn().mockResolvedValue(fakeUsers[0]),
      findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
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

    it("Shouldn't create a duplicated user", async () => {
      const prismaError = new PrismaClientKnownRequestError(
        "Unique constraint failed on the constraint: `User_cpf_key`",
        { clientVersion: "5.14.0", code: "P2002" }
      );

      jest
        .spyOn(prismaService.user, "create")
        .mockRejectedValueOnce(prismaError);

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

      expect(userService.create(userToBeCreated)).rejects.toThrow(
        PrismaClientKnownRequestError
      );
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("Should list all users successfully", async () => {
      const users = await userService.findAll();

      expect(users).toEqual(fakeUsers);
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("Should find a specific user", async () => {
      const user = await userService.findOne("70031242546");

      expect(user).toEqual(fakeUsers[0]);
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Should throw an exception when find a non existent user", () => {
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockRejectedValueOnce(new NotFoundException("User not found."));

      expect(userService.findOne("70031242666")).rejects.toThrow(
        NotFoundException
      );
    });

    it("Should throw an exception when find a deleted user", () => {
      jest
        .spyOn(prismaService.user, "findUnique")
        .mockRejectedValueOnce(new BadRequestException("User deleted."));

      expect(userService.findOne("70031242546")).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
