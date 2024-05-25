import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { Address } from "@prisma/client";
import { AddressDTO } from "./dto/address.dto";
import { AddressUpdateDTO } from "./dto/address-update.dto";

@Injectable()
export class AddressService {
  constructor(private readonly prismaService: PrismaService) {}

  public async updateAddressOfUser(
    userId: string,
    addressUpdateDTO: AddressUpdateDTO
  ) {
    const addressOfUser = await this.findAddressByUser(userId);

    const updatedAddress = await this.prismaService.address.update({
      where: addressOfUser,
      data: addressUpdateDTO
    });

    return this.convertToAddressDTO(updatedAddress);
  }

  public async findAll() {
    const addresses = await this.prismaService.address.findMany();

    return addresses;
  }

  private async findAddressByUser(userId: string) {
    const address = await this.prismaService.address.findUnique({
      where: { userId }
    });

    if (!address) throw new NotFoundException("User not found.");

    return address;
  }

  private convertToAddressDTO(address: Address) {
    const { id, userId, ...rest } = address;

    const addressDTO: AddressDTO = rest;

    return addressDTO;
  }
}
