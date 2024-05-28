import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { hashSync } from "bcrypt";
import { PrismaService } from "../../database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { Status, User } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";
import { AddressUpdateDTO } from "../address/dto/address-update.dto";
import { AddressService } from "../address/address.service";
import { JwtPayload } from "../auth/dto/jwt-payload.dto";
import { UserType } from "./enum/user-type.enum";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly addressService: AddressService
  ) {}

  public async create(userCreateDTO: UserCreateDTO, activeUserCpf: string) {
    const { address, ...user } = userCreateDTO;

    user.password = hashSync(userCreateDTO.password, 10);

    const createdUser = await this.prismaService.user.create({
      data: {
        ...user,
        address: { create: address },
        createdBy: activeUserCpf
      }
    });

    return this.convertToUserDTO(createdUser);
  }

  public async firstAccess() {
    const user = await this.prismaService.user.findUnique({
      where: { cpf: "66666666666" }
    });

    if (user)
      throw new BadRequestException("First access user already created.");

    const firstAccessUserDTO: UserCreateDTO = {
      cpf: "66666666666",
      name: "First access User",
      password: "1234",
      birth: new Date(),
      address: {
        street: "Rua 2",
        number: "4",
        district: "Boa Vista",
        city: "São Paulo",
        state: "SP",
        cep: "01046851"
      },
      status: "ACTIVE"
    };

    const userDTO = await this.create(
      firstAccessUserDTO,
      firstAccessUserDTO.cpf
    );

    await this.prismaService.user.update({
      where: { cpf: userDTO.cpf },
      data: { typeUser: UserType.Root }
    });

    return userDTO;
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

  public async updateUser(
    cpf: string,
    userUpdateDTO: UserUpdateDTO,
    activeUserCpf: string
  ) {
    const user = await this.getUser(cpf);

    if (userUpdateDTO.password) {
      userUpdateDTO.password = hashSync(userUpdateDTO.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: user,
      data: {
        ...userUpdateDTO,
        updatedAt: new Date().toISOString(),
        updatedBy: activeUserCpf
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

  public async remove(cpf: string, activeUserCpf: string) {
    const user = await this.getUser(cpf);

    const date = new Date().toISOString();

    const deletedUser = await this.prismaService.user.update({
      where: user,
      data: {
        status: Status.DELETED,
        deletedAt: date,
        deletedBy: activeUserCpf
      }
    });

    return this.convertToUserDTO(deletedUser);
  }

  public async getUserWithPassword(cpf: string) {
    const user = await this.getUser(cpf);

    const userDTO = this.convertToUserDTO(user);

    return { ...userDTO, password: user.password };
  }

  private async getUser(cpf: string) {
    const user = await this.prismaService.user.findUnique({ where: { cpf } });

    if (!user) throw new NotFoundException("User not found.");

    if (user.status == Status.DELETED)
      throw new BadRequestException("User deleted.");

    return user;
  }

  private convertToUserDTO(user: User) {
    const { id, cpf, name, birth, status, typeUser } = user;

    const userDTO: UserDTO = { id, cpf, name, birth, status, typeUser };

    return userDTO;
  }
}
