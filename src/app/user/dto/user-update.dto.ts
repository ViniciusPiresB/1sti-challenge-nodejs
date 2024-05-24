import { Status } from "@prisma/client";

export class UserUpdateDTO{
    name?: string;
    birth?: Date;
    status?: Status;
    updatedBy: string;
}