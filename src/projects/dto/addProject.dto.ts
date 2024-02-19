import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class addProject {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
