import { ApiProperty } from "@nestjs/swagger";

export class AddFile {
  @ApiProperty({ type: "string", format: "binary", required: true })
  idImage: string;
}
