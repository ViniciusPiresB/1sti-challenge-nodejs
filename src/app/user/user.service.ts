import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(userCreateDTO: UserCreateDTO) {
        const { address, ...user } = userCreateDTO;

        const createdUser = await this.prismaService.user.create({
            data: { ...user, address: { create: address } }
        })

        return createdUser;
    }

    public async findOne(cpf: string) {
        const user = await this.getUser(cpf);

        return user;
    }
    private getUser(cpf: string) {
        const user = this.prismaService.user.findUnique({ where: {cpf} });

        if(!user) throw new NotFoundException("User not found.");

        return user;
    }
}