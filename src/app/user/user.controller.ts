import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() userCreateDTO: UserCreateDTO) {
        return this.userService.create(userCreateDTO);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(":cpf")
    findOne(@Param("cpf") cpf: string) {
        return this.userService.findOne(cpf);
    }
    
    @Get("/address/:cpf")
    findUserWithAddress(@Param("cpf") cpf: string) {
        return this.userService.findUserWithAddress(cpf);
    }

    @Patch(":cpf")
    update(@Param("cpf") cpf: string, @Body() userUpdateDTO: UserUpdateDTO) {
        return this.userService.updateUser(cpf, userUpdateDTO)
    }

    @Delete(":cpf")
    remove(@Param("cpf") cpf: string) {
        return this.userService.remove(cpf);
    }
}