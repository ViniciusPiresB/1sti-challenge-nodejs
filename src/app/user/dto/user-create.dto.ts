import { Status } from "@prisma/client";
import { AddressCreateDTO } from "src/app/address/dto/address-create.dto";

export class UserCreateDTO{
    id: string;
    cpf: string;
    name: string;
    birth: Date;
    address: AddressCreateDTO;
    status: Status;
}