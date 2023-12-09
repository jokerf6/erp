import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../../prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<any>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    if (!requiredRoles) {
      throw new Error(
        "RolesGuard can't be used without @Roles() decorator initiated with roles"
      );
    }

    const roles = await this.prisma.position.findMany({
      select: {
        name: true,
      },
    });

    if (
      !requiredRoles.some(
        (role) => req.user.userObject?.jobPosition.name === role
      )
    ) {
      return false;
    }
    return true;
  }
}

export const ROLES_KEY = "roles";
export const Roles = (...roles: any) => {
  if (roles.length === 0) throw new Error("Roles cannot be empty");
  return SetMetadata(ROLES_KEY, roles);
};
