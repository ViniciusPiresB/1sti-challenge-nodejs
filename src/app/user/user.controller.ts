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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Creates a user." })
  @ApiCreatedResponse({ description: "Created Successfully." })
  @ApiConflictResponse({ description: "User already exist." })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Post()
  create(
    @Body() userCreateDTO: UserCreateDTO,
    @GetUser() activeUser: JwtPayload
  ) {
    const activeUserCpf = activeUser.cpf;

    return this.userService.create(userCreateDTO, activeUserCpf);
  }

  @ApiOperation({ summary: "List all users." })
  @ApiOkResponse({ description: "List all users." })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiOperation({ summary: "test" })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "Find one user." })
  @ApiOkResponse({ description: "Find one user." })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Get(":cpf")
  findOne(@Param("cpf") cpf: string) {
    return this.userService.findOne(cpf);
  }

  @ApiOperation({ summary: "Find a user with address." })
  @ApiOkResponse({ description: "Find one user with address." })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Get("/address/:cpf")
  findUserWithAddress(@Param("cpf") cpf: string) {
    return this.userService.findUserWithAddress(cpf);
  }

  @ApiOperation({ summary: "Update one user." })
  @ApiOkResponse({ description: "Update one user." })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Remove one user." })
  @ApiOkResponse({ description: "Delete one user." })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Delete(":cpf")
  remove(@Param("cpf") cpf: string, @GetUser() activeUser: JwtPayload) {
    const activeUserCpf = activeUser.cpf;

    return this.userService.remove(cpf, activeUserCpf);
  }
}
