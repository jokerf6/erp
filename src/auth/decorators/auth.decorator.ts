import {
  ForbiddenException,
  SetMetadata,
  UseGuards,
  applyDecorators,
} from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { features } from "@prisma/client";
import { IsNotIn } from "class-validator";
import { CurrentUser } from "./current-user.decorator";
export function Auth(
  { feature = undefined }: { feature?: features },
  ctx?: ExecutionContext
) {
  const guards: any = [AuthGuard(["jwt"])];

  return applyDecorators(UseGuards(...guards), ApiBearerAuth());
}
