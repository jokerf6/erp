import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty } from "class-validator";

export class AddComment {
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
