import { Status } from "@prisma/client";
import { AddressCreateDTO } from "src/app/address/dto/address-create.dto";

export class UserUpdateDTO{
    name?: string;
    birth?: Date;
    status?: Status;
    createdBy?: string;
}