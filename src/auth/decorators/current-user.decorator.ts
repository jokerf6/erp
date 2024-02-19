import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (key: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (key) return request.user[key];
    return request.user;
  }
);
