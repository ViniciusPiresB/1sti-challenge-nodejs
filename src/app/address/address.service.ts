import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserService } from "../user/user.service";
import { Address } from "@prisma/client";
import { AddressDTO } from "./dto/address.dto";
import { AddressUpdateDTO } from "./dto/address-update.dto";

@Injectable()
export class AddressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  public async updateAddressOfUser(
    cpf: string,
    addressUpdateDTO: AddressUpdateDTO
  ) {
    const addressOfUser = await this.findAddressByUser(cpf);

    const updatedAddress = await this.prismaService.address.update({
      where: addressOfUser,
      data: addressUpdateDTO
    });

    return this.convertToAddressDTO(updatedAddress);
  }

  private async findAddressByUser(cpf: string) {
    const user = await this.userService.findOne(cpf);

    const address = await this.prismaService.address.findUnique({
      where: { userId: user.id }
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
