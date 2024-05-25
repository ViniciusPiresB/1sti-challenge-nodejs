import { Status } from "@prisma/client";

export class UserDTO {
  id: string;
  cpf: string;
  name: string;
  birth: Date;
  status: Status;
  typeUser: number;
}
