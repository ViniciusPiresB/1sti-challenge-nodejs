import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { AdminRole, UserRole } from "../auth/roles/roles";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "../decorator/get-user.decorator";
import { JwtPayload } from "../auth/dto/jwt-payload.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(...AdminRole)
  @Post()
  create(
    @Body() userCreateDTO: UserCreateDTO,
    @GetUser() activeUser: JwtPayload
  ) {
    const activeUserCpf = activeUser.cpf;

    return this.userService.create(userCreateDTO, activeUserCpf);
  }

  @Roles(...AdminRole)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(...AdminRole)
  @Get(":cpf")
  findOne(@Param("cpf") cpf: string) {
    return this.userService.findOne(cpf);
  }

  @Roles(...AdminRole)
  @Get("/address/:cpf")
  findUserWithAddress(@Param("cpf") cpf: string) {
    return this.userService.findUserWithAddress(cpf);
  }

  @Get("/address")
  @UseGuards(JwtAuthGuard)
  @Roles(...UserRole)
  findOneUserWithAddress(@GetUser() user: JwtPayload) {
    return this.userService.findUserWithAddress(user.cpf);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @Roles(...UserRole)
  updateOneUser(
    @GetUser() user: JwtPayload,
    @Body() userUpdateDTO: UserUpdateDTO
  ) {
    const activeUserCpf = user.cpf;

    return this.userService.updateUser(user.cpf, userUpdateDTO, activeUserCpf);
  }

  @Roles(...AdminRole)
  @Patch(":cpf")
  update(
    @Param("cpf") cpf: string,
    @Body() userUpdateDTO: UserUpdateDTO,
    @GetUser() activeUser: JwtPayload
  ) {
    const activeUserCpf = activeUser.cpf;

    return this.userService.updateUser(cpf, userUpdateDTO, activeUserCpf);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @Roles(...UserRole)
  removeOneUser(@GetUser() user: JwtPayload) {
    return this.userService.remove(user.cpf, user.cpf);
  }

  @Roles(...AdminRole)
  @Delete(":cpf")
  remove(@Param("cpf") cpf: string, @GetUser() activeUser: JwtPayload) {
    const activeUserCpf = activeUser.cpf;

    return this.userService.remove(cpf, activeUserCpf);
  }
}
