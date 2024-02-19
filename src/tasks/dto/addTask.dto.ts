import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty } from "class-validator";

class assignees {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  admin: boolean;
}
export class AddTask {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  projectId: string;
  @ApiProperty({ isArray: true })
  @IsNotEmpty()
  AssigneesId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  dueData: Date;

  @ApiProperty()
  @IsNotEmpty()
  priority: string;
  @ApiProperty()
  @IsNotEmpty()
  description?: string;
}
