import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Verify {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
