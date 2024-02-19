import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { features } from "@prisma/client";

export const RolesGuard = createParamDecorator(
  (feature: features, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user["roles"]);
    const roles = request.user["roles"].filter(
      (item: any) => item.feature === feature
    ).length;
    if (roles === 0) {
      throw new ForbiddenException(
        "Unauthorized: User does not have required roles"
      );
    } else {
      return request.user;
    }
  }
);
