import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { Status, User } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { AddressUpdateDTO } from "../address/dto/address-update.dto";
import { AddressService } from "../address/address.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly addressService: AddressService
  ) {}

  public async create(userCreateDTO: UserCreateDTO) {
    const { address, ...user } = userCreateDTO;

    const createdUser = await this.prismaService.user.create({
      data: { ...user, address: { create: address } }
    });

    return this.convertToUserDTO(createdUser);
  }

  public async findOne(cpf: string) {
    const user = await this.getUser(cpf);

    return this.convertToUserDTO(user);
  }

  public async findUserWithAddress(cpf: string) {
    const user = await this.getUser(cpf);

    const userWithAddress = await this.prismaService.user.findUnique({
      where: user,
      include: { address: true }
    });

    const userDTO = this.convertToUserDTO(user);

    const result = { ...userDTO, address: userWithAddress.address };

    return result;
  }

  public async findAll() {
    const users = await this.prismaService.user.findMany();

    const activeUsers = users.filter((user) => {
      if (user.status == Status.ACTIVE) return true;

      return false;
    });

    if (!activeUsers) return [];

    const usersDTO = activeUsers.map((user) => {
      return this.convertToUserDTO(user);
    });

    return usersDTO;
  }

  public async updateUser(cpf: string, userUpdateDTO: UserUpdateDTO) {
    const user = await this.getUser(cpf);

    const updatedUser = await this.prismaService.user.update({
      where: user,
      data: {
        ...userUpdateDTO,
        updatedAt: new Date().toISOString()
      }
    });

    return this.convertToUserDTO(updatedUser);
  }

  public async updateAddress(cpf: string, addressUpdateDTO: AddressUpdateDTO) {
    const user = await this.getUser(cpf);

    const updatedAddress = await this.addressService.updateAddressOfUser(
      user.id,
      addressUpdateDTO
    );

    return updatedAddress;
  }

  public async remove(cpf: string) {
    const user = await this.getUser(cpf);

    const date = new Date().toISOString();

    const deletedUser = await this.prismaService.user.update({
      where: user,
      data: {
        status: Status.DELETED,
        deletedAt: date,
        deletedBy: "FAZER AQUI JWT"
      }
    });

    return this.convertToUserDTO(deletedUser);
  }

  private async getUser(cpf: string) {
    const user = await this.prismaService.user.findUnique({ where: { cpf } });

    if (!user) throw new NotFoundException("User not found.");

    if (user.status == Status.DELETED)
      throw new BadRequestException("User deleted.");

    return user;
  }

  private convertToUserDTO(user: User) {
    const { id, cpf, name, birth, status } = user;

    const userDTO: UserDTO = { id, cpf, name, birth, status };

    return userDTO;
  }
}
