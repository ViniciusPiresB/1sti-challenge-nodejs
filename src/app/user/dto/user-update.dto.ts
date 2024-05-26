import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class UserUpdateDTO {
  @ApiProperty({
    title: "Name of user",
    type: String,
    description: "This is not a required property",
    example: "John Doe",
    required: false
  })
  @IsString()
  name?: string;

  @ApiProperty({
    title: "Password of user",
    type: String,
    example: "pass123",
    description: "This is not a required property",
    required: false
  })
  password?: string;

  @ApiProperty({
    title: "Birth date of user",
    type: Date,
    description: "This is not a required property",
    required: false
  })
  @IsDateString()
  birth?: Date;

  @ApiProperty({
    title: "Status of user",
    type: String,
    description: "This is not a required property",
    example: "ACTIVE | DELETED",
    required: false
  })
  @IsString()
  status?: Status;
}
