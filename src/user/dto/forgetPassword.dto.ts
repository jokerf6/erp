import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgetPassword {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
