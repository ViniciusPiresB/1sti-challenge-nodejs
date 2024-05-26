import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressUpdateDTO } from "./dto/address-update.dto";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { Roles } from "../auth/decorator/roles.decorator";
import { AdminRole } from "../auth/roles/roles";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@ApiTags("Address")
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: "List all addresses." })
  @ApiOkResponse({ description: "List all addresses." })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @ApiOperation({ summary: "Update one address." })
  @ApiOkResponse({ description: "Update one address." })
  @ApiNotFoundResponse({ description: "Address not found" })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
  @ApiBearerAuth()
  @Roles(...AdminRole)
  @UseGuards(JwtAuthGuard)
  @Patch(":cpf")
  updateAddressOfUser(
    @Param("cpf") cpf: string,
    @Body() addressUpdateDTO: AddressUpdateDTO
  ) {
    return this.addressService.updateAddressOfUser(cpf, addressUpdateDTO);
  }
}
