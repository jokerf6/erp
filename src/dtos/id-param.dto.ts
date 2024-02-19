import { IsOptional, IsString } from "class-validator";

export class RequiredIdParam {
  @IsString()
  id: string;
}

export class OptionalIdParam {
  @IsOptional()
  @IsString()
  id?: string;
}
