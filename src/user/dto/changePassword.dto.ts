import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePassword {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
