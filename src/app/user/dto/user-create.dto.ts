import { Status } from "@prisma/client";
import { AddressCreateDTO } from "src/app/address/dto/address-create.dto";

export class UserCreateDTO{
    cpf: string;
    password: string;
    name: string;
    birth: Date;
    address: AddressCreateDTO;
    status: Status;
    createdBy: string;
}