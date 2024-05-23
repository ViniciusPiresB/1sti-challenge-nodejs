import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDTO } from "./dto/user-create.dto";

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
}