import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddressCreateDTO {
  @ApiProperty({
    title: "Street of address",
    type: String,
    description: "This is a required property",
    example: "Rua 5",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    title: "Number of address",
    type: String,
    description: "This is a required property",
    example: "4 | S/N",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    title: "District of address",
    type: String,
    description: "This is a required property",
    example: "Boa Vista",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({
    title: "City of address",
    type: String,
    description: "This is a required property",
    example: "São Paulo",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    title: "State of address",
    type: String,
    description: "This is a required property",
    example: "SP",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    title: "CEP of address",
    type: String,
    description: "This is a required property",
    example: "010659746",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  cep: string;
}
