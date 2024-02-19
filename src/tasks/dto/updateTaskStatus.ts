// Apply the EnumArrayFilter decorator to validate and document an array of TaskStatus values

import { ApiProperty } from "@nestjs/swagger";
import { taskStatus } from "@prisma/client";
import { IsEnum } from "class-validator";
export enum Status {
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
}
export class editTaskStatus {
  @ApiProperty({ enum: Status, enumName: "Status", example: "pending" })
  statuses: taskStatus;
}
