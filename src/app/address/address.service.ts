import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserService } from "../user/user.service";
import { Address } from "@prisma/client";
import { AddressDTO } from "./dto/address.dto";

@Injectable()
export class AddressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  private async findAddressByUser(cpf: string) {
    const user = await this.userService.findOne(cpf);

    const address = await this.prismaService.address.findUnique({
      where: { userId: user.id }
    });

    if (!address) throw new NotFoundException("User not found.");

    return this.convertToAddressDTO(address);
  }

  private convertToAddressDTO(address: Address) {
    const { id, userId, ...rest } = address;

    const addressDTO: AddressDTO = rest;

    return addressDTO;
  }
}
