import { PrismaService } from "../../database/prisma.service";
import { AddressService } from "./address.service";
import { Address } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";
import { AddressUpdateDTO } from "./dto/address-update.dto";
import { NotFoundException } from "@nestjs/common";

describe("AddressService", () => {
  let addressService: AddressService;
  let prismaService: PrismaService;

  const fakeAddresses: Address[] = [
    {
      id: 1,
      street: "123 Main St",
      number: "456",
      district: "District",
      city: "City",
      state: "State",
      cep: "12345-678",
      userId: "1"
    },
    {
      id: 2,
      street: "456 Main St",
      number: "789",
      district: "District 2",
      city: "City 2",
      state: "State 2",
      cep: "12345-678910",
      userId: "2"
    }
  ];

  const updatedAddress: Address = {
    ...fakeAddresses[0],
    street: "Updated street"
  };

  const prismaMock = {
    address: {
      findUnique: jest.fn().mockResolvedValue(fakeAddresses[0]),
      update: jest.fn().mockResolvedValue(updatedAddress),
      findMany: jest.fn().mockResolvedValue(fakeAddresses)
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: PrismaService, useValue: prismaMock }
      ]
    }).compile();

    addressService = module.get<AddressService>(AddressService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    prismaMock.address.findUnique.mockClear(),
      prismaMock.address.findMany.mockClear(),
      prismaMock.address.update.mockClear();
  });

  it("Should be defined", () => {
    expect(addressService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe("updateAddressOfUser", () => {
    it("Should update an address of a user", async () => {
      const addressUpdateDTO: AddressUpdateDTO = {
        street: "Updated street"
      };

      const { id, userId, ...rest } = fakeAddresses[0];

      const result = await addressService.updateAddressOfUser(
        userId,
        addressUpdateDTO
      );

      expect(result).toEqual({ ...rest, ...addressUpdateDTO });
      expect(prismaService.address.update).toHaveBeenCalledTimes(1);
      expect(prismaService.address.update).toHaveBeenCalledWith({
        where: fakeAddresses[0],
        data: addressUpdateDTO
      });
    });

    it("Shouldn't update an address of a not found user", async () => {
      jest
        .spyOn(addressService, "findAddressByUser")
        .mockRejectedValueOnce(new NotFoundException("User not found."));

      const userId = fakeAddresses[0].userId;

      const addressUpdateDTO: AddressUpdateDTO = {
        street: "Updated street"
      };

      await expect(
        addressService.updateAddressOfUser(userId, addressUpdateDTO)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    it("Should return all addresses", async () => {
      const result = await addressService.findAll();

      expect(result).toEqual(fakeAddresses);
      expect(prismaService.address.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
