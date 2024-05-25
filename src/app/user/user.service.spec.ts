import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../../database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Status, User } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { AddressDTO } from "../address/dto/address.dto";
import { AddressService } from "../address/address.service";
import { AddressUpdateDTO } from "../address/dto/address-update.dto";

describe("UserService", () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let addressService: AddressService;

  const fakeUser: User = {
    id: "a3718843-5456-4482-9c97-a20f78cbd44e",
    cpf: "70031242546",
    name: "Test User 1",
    birth: new Date(),
    status: Status.ACTIVE,
    createdAt: new Date(),
    createdBy: "Admin",
    updatedAt: undefined,
    updatedBy: undefined,
    deletedAt: undefined,
    deletedBy: undefined
  };

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

  const fakeUserAddress: AddressDTO = {
    street: "Fake street",
    number: "S/N",
    district: "Fake district",
    city: "Fake city",
    state: "Fake state",
    cep: "Fake cep"
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

  const addressServiceMock = {
    updateAddressOfUser: jest.fn((userId, dto) => {
      return { ...fakeUserAddress, ...dto };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: AddressService, useValue: addressServiceMock }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    addressService = module.get<AddressService>(AddressService);
  });

  afterEach(() => {
    prismaMock.user.create.mockClear();
    prismaMock.user.findMany.mockClear();
    prismaMock.user.findFirst.mockClear();
    prismaMock.user.update.mockClear();
    prismaMock.user.delete.mockClear();
    prismaMock.user.findUnique.mockClear();
    prismaMock.user.findUnique.mockResolvedValue(fakeUsers[0]);
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

  describe("findUserWithAddress", () => {
    it("Should find a specific user with address", async () => {
      const fakeAddress = {
        ...fakeUserAddress,
        id: Date.now().toString(),
        userId: fakeUser.id
      };

      const fakeUserWithAddress = {
        ...fakeUser,
        address: fakeAddress
      };

      jest
        .spyOn(prismaService.user, "findUnique")
        .mockResolvedValue(fakeUserWithAddress);

      const cpf = fakeUsers[0].cpf;

      const userWithAddress = await userService.findUserWithAddress(cpf);

      expect(userWithAddress).toEqual({
        ...fakeUsers[0],
        address: fakeAddress
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe("updateAddress", () => {
    it("Should update an address", async () => {
      const cpf = fakeUsers[0].cpf;

      const addressUpdateDTO: AddressUpdateDTO = {
        street: "Updated street",
        city: "Updated city"
      };

      const result = await userService.updateAddress(cpf, addressUpdateDTO);

      expect(result).toEqual({ ...fakeUserAddress, ...addressUpdateDTO });
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(addressServiceMock.updateAddressOfUser).toHaveBeenCalledTimes(1);
      expect(addressServiceMock.updateAddressOfUser).toHaveBeenCalledWith(
        fakeUser.id,
        addressUpdateDTO
      );
    });
  });

  describe("update", () => {
    it("should update a user successfully", async () => {
      const cpf = fakeUsers[0].cpf;

      const userUpdateDTO: UserUpdateDTO = {
        name: "Updated Test User",
        status: Status.ACTIVE,
        updatedBy: "Admin"
      };

      const result = await userService.updateUser(cpf, userUpdateDTO);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { cpf }
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: fakeUsers[0],
        data: { ...userUpdateDTO, updatedAt: expect.any(String) }
      });
      expect(result).toEqual(updatedFakeUser);
    });

    it("Shouldn't update a not found user", async () => {
      const cpf = "39513525424";

      const userUpdateDTO: UserUpdateDTO = {
        name: "Updated Test User",
        status: Status.ACTIVE,
        updatedBy: "Admin"
      };

      jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce(null);

      await expect(userService.updateUser(cpf, userUpdateDTO)).rejects.toThrow(
        NotFoundException
      );
    });

    it("Shouldn't update a deleted user", async () => {
      const deletedFakeUser: User = {
        id: "a3718843-5456-4482-9c97-a20f78cbd44e",
        cpf: "70031242546",
        name: "Deleted Test User",
        birth: new Date(),
        status: Status.DELETED,
        createdAt: new Date(),
        createdBy: "Admin",
        updatedAt: new Date(),
        updatedBy: "Admin",
        deletedAt: new Date(),
        deletedBy: "Admin"
      };

      const cpf = deletedFakeUser.cpf;

      const userUpdateDTO: UserUpdateDTO = {
        name: "Updated Test User",
        status: Status.ACTIVE,
        updatedBy: "Admin"
      };

      jest
        .spyOn(prismaService.user, "findUnique")
        .mockResolvedValueOnce(deletedFakeUser);

      await expect(userService.updateUser(cpf, userUpdateDTO)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("remove", () => {
    it("Should remove a user successfully", async () => {
      const cpf = deletedFakeUser.cpf;

      const deletedUser: User = {
        id: "a3718843-5456-4482-9c97-a20f78cbd44e",
        cpf: "70031242546",
        name: "Deleted Test User",
        birth: deletedFakeUser.birth,
        status: Status.DELETED,
        createdAt: new Date(),
        createdBy: "Admin",
        updatedAt: new Date(),
        updatedBy: "Admin",
        deletedAt: new Date(),
        deletedBy: "Admin"
      };

      jest
        .spyOn(prismaService.user, "update")
        .mockResolvedValueOnce(deletedUser);

      const result = await userService.remove(cpf);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { cpf }
      });
      expect(result).toEqual(deletedFakeUser);
    });

    it("Shouldn't remove a not found user", async () => {
      const cpf = "46846246366";

      jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce(null);

      await expect(userService.remove(cpf)).rejects.toThrow(NotFoundException);
    });

    it("Shouldn't remove a deleted user", async () => {
      const deletedUser: User = {
        id: "a3718843-5456-4482-9c97-a20f78cbd44e",
        cpf: "70031242546",
        name: "Deleted Test User",
        birth: deletedFakeUser.birth,
        status: Status.DELETED,
        createdAt: new Date(),
        createdBy: "Admin",
        updatedAt: new Date(),
        updatedBy: "Admin",
        deletedAt: new Date(),
        deletedBy: "Admin"
      };

      const cpf = deletedUser.cpf;

      jest
        .spyOn(prismaService.user, "findUnique")
        .mockResolvedValueOnce(deletedUser);

      await expect(userService.remove(cpf)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
