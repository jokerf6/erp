import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignIn {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  workEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
