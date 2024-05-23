import { Status } from "@prisma/client";
import { AddressDTO } from "src/app/address/dto/address.dto";

export class UserDTO{
    id: string;
    cpf: string;
    name: string;
    birth: Date;
    address: AddressDTO;
    status: Status;
}