import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    title: "CPF of user to login",
    type: String,
    description: "This is a required property",
    example: "12345678910",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    title: "Password of user to login",
    type: String,
    description: "This is a required property",
    example: "pass123",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
