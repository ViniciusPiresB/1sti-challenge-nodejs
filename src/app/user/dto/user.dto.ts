import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";

export class UserDTO {
  @ApiProperty({
    title: "Id of user",
    type: String,
    example: "a3718843-5456-4482-9c97-a20f78cbd44e",
    required: true
  })
  id: string;

  @ApiProperty({
    title: "Cpf of user",
    type: String,
    example: "12345678910",
    required: true
  })
  cpf: string;

  @ApiProperty({
    title: "Name of user",
    type: String,
    example: "John Doe",
    required: true
  })
  name: string;

  @ApiProperty({
    title: "Birth of user",
    type: Date,
    example: "2001-09-17T15:25:53Z",
    required: true
  })
  birth: Date;

  @ApiProperty({
    title: "Status of user",
    type: String,
    example: "ACTIVE | DELETED",
    required: true
  })
  status: Status;

  @ApiProperty({
    title: "Type of user",
    type: Number,
    example: "1 | 2 | 3",
    required: true
  })
  typeUser: number;
}
