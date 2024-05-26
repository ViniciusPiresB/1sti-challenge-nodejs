import { ApiProperty } from "@nestjs/swagger";

export class AddressDTO {
  @ApiProperty({
    title: "Street of address",
    type: String,
    description: "This is a required property",
    example: "Rua 5",
    required: true
  })
  street: string;

  @ApiProperty({
    title: "Number of address",
    type: String,
    description: "This is a required property",
    example: "4 | S/N",
    required: true
  })
  number: string;

  @ApiProperty({
    title: "District of address",
    type: String,
    description: "This is a required property",
    example: "Boa Vista",
    required: true
  })
  district: string;

  @ApiProperty({
    title: "City of address",
    type: String,
    description: "This is a required property",
    example: "São Paulo",
    required: true
  })
  city: string;

  @ApiProperty({
    title: "State of address",
    type: String,
    description: "This is a required property",
    example: "SP",
    required: true
  })
  state: string;

  @ApiProperty({
    title: "CEP of address",
    type: String,
    description: "This is a required property",
    example: "010659746",
    required: true
  })
  cep: string;
}
