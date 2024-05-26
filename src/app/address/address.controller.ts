import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressUpdateDTO } from "./dto/address-update.dto";
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";

@ApiTags("Address")
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: "List all addresses." })
  @ApiOkResponse({ description: "List all addresses." })
  @ApiForbiddenResponse({
    description: "Missing token or not enough permission."
  })
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
  @Patch(":cpf")
  updateAddressOfUser(
    @Param("cpf") cpf: string,
    @Body() addressUpdateDTO: AddressUpdateDTO
  ) {
    return this.addressService.updateAddressOfUser(cpf, addressUpdateDTO);
  }
}
