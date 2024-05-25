import { Status } from "@prisma/client";

export type JwtPayload = {
  id: string;
  cpf: string;
  name: string;
  birth: string;
  status: Status;
  typeUser: number;
  iat: number;
};
