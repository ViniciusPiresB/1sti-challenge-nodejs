import { Status } from "@prisma/client";

export class UserUpdateDTO{
    name?: string;
    password?: string;
    birth?: Date;
    status?: Status;
    updatedBy: string;
}