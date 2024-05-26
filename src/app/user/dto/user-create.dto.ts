import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsDateString, IsNotEmpty, IsString, Length } from "class-validator";
import { AddressCreateDTO } from "../../address/dto/address-create.dto";

export class UserCreateDTO {
  @ApiProperty({
    title: "Cpf of user",
    type: String,
    description: "This is a required property",
    example: "12345678910",
    required: true
  })
  @IsString()
  @Length(11, 11, { message: "CPF must be exactly 11 characters long" })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    title: "Password of user",
    type: String,
    example: "pass123",
    description: "This is a required property",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    title: "Name of user",
    type: String,
    example: "John Doe",
    description: "This is a required property",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: "Birth date of user",
    type: Date,
    description: "This is a required property",
    required: true
  })
  @IsDateString()
  @IsNotEmpty()
  birth: Date;

  @ApiProperty({
    title: "Address of user",
    description: "This is a required property",
    required: true
  })
  address: AddressCreateDTO;

  @ApiProperty({
    title: "Status of user",
    type: String,
    description: "This is a required property",
    example: "ACTIVE | DELETED",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  status: Status;
}
