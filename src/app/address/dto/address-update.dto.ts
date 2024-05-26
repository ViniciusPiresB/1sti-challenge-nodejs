import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddressUpdateDTO {
  @ApiProperty({
    title: "Street of address",
    type: String,
    description: "This is not a required property",
    example: "Rua 5",
    required: false
  })
  @IsString()
  street?: string;

  @ApiProperty({
    title: "Number of address",
    type: String,
    description: "This is not a required property",
    example: "4 |  S/N",
    required: false
  })
  @IsString()
  number?: string;

  @ApiProperty({
    title: "District of address",
    type: String,
    description: "This is not a required property",
    example: "Boa Vista",
    required: false
  })
  @IsString()
  district?: string;

  @ApiProperty({
    title: "City of address",
    type: String,
    description: "This is not a required property",
    example: "São Paulo",
    required: false
  })
  @IsString()
  city?: string;

  @ApiProperty({
    title: "State of address",
    type: String,
    description: "This is not a required property",
    example: "SP",
    required: false
  })
  @IsString()
  state?: string;

  @ApiProperty({
    title: "CEP of address",
    type: String,
    description: "This is not a required property",
    example: "010649587",
    required: false
  })
  @IsString()
  cep?: string;
}
