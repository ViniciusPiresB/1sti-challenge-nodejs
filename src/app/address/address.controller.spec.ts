import { Address, Status } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { AddressDTO } from "./dto/address.dto";
import { AddressUpdateDTO } from "./dto/address-update.dto";

describe("AddressController", () => {
  let addressController: AddressController;
  let addressService: AddressService;

  const fakeAddressesDTO: AddressDTO[] = [
    {
      street: "123 Main St",
      number: "456",
      district: "District",
      city: "City",
      state: "State",
      cep: "12345-678"
    },
    {
      street: "456 Main St",
      number: "789",
      district: "District 2",
      city: "City 2",
      state: "State 2",
      cep: "12345-678910"
    }
  ];

  const fakeAddresses: Address[] = [
    {
      ...fakeAddressesDTO[0],
      id: Date.now(),
      userId: Date.now().toString()
    },
    {
      ...fakeAddressesDTO[1],
      id: Date.now(),
      userId: Date.now().toString()
    }
  ];

  const addressServiceMock = {
    findAll: jest.fn().mockResolvedValue(fakeAddresses),
    updateAddressOfUser: jest.fn((cpf, dto) => {
      return { ...fakeAddressesDTO[0], ...dto };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [{ provide: AddressService, useValue: addressServiceMock }]
    }).compile();

    addressController = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  afterEach(() => {
    addressServiceMock.findAll.mockClear();
    addressServiceMock.updateAddressOfUser.mockClear();
  });

  it("Should be defined", () => {
    expect(addressController).toBeDefined();
  });

  describe("findAll", () => {
    it("Should list all addresses", async () => {
      const result = await addressController.findAll();

      expect(result).toEqual(fakeAddresses);
      expect(addressService.findAll).toHaveBeenCalledTimes(1);
    });
  });

});
