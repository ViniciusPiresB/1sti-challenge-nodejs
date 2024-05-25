import { Body, Controller, Param, Patch } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressUpdateDTO } from "./dto/address-update.dto";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Patch(":cpf")
  updateAddressOfUser(
    @Param("cpf") cpf: string,
    @Body() addressUpdateDTO: AddressUpdateDTO
  ) {
    return this.addressService.updateAddressOfUser(cpf, addressUpdateDTO);
  }
}
