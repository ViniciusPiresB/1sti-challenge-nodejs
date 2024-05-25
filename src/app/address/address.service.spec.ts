import { PrismaService } from "../../database/prisma.service";
import { AddressService } from "./address.service";
import { Address } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";

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
});
