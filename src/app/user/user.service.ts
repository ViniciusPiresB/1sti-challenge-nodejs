import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { Status, User } from "@prisma/client";
import { UserDTO } from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(userCreateDTO: UserCreateDTO) {
        const { address, ...user } = userCreateDTO;

        const createdUser = await this.prismaService.user.create({
            data: { ...user, address: { create: address } }
        })

        return this.convertToUserDTO(createdUser);
    }

    public async findOne(cpf: string) {
        const user = await this.getUser(cpf);

        return this.convertToUserDTO(user);
    }

    public async findAll() {
        const users = await this.prismaService.user.findMany();

        const activeUsers = users.filter(user => { 
            if(user.status == Status.ACTIVE) return true;

            return false;
         });

        if(!activeUsers) return [];

        const usersDTO = activeUsers.map(user => { return this.convertToUserDTO(user) });

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
        })

        return this.convertToUserDTO(updatedUser);
    }

    public async remove(cpf: string) {
        await this.getUser(cpf);

        const deletedUser = await this.prismaService.user.delete({ where: { cpf }});

        return deletedUser;
    }

    private getUser(cpf: string) {
        const user = this.prismaService.user.findUnique({ where: {cpf} });

        if(!user) throw new NotFoundException("User not found.");

        return user;
    }

    private convertToUserDTO(user: User) {
        const { id, cpf, name, birth, status } = user;

        const userDTO: UserDTO = { id, cpf, name, birth, status };

        return userDTO;
    }
}