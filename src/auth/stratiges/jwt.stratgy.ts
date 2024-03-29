import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "../../../prisma.service";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jsonWebTokenOptions: {
        maxAge: 1 * 24 * 60 * 60,
      },
    });
  }
  async validate(payload: any, done) {
    const jti = await this.prisma.token.findFirst({
      where: {
        id: payload.id,
        valid: true,
      },
    });
    if (jti) {
      const user = await this.prisma.user.findFirst({
        where: { id: payload.userId },
        include: {
          jobPosition: true,
          department: true,
        },
      });
      if (user) {
        const roles = await this.prisma.roles.findMany({
          where: {
            jobPositionId: user.jobPositionId,
            departmentId: user.departmentId,
          },
          select: {
            feature: true,
          },
        });
        done(null, {
          ...user,
          roles: roles,
          jti: jti["id"],
          refresh: payload.refresh || false,
        });
      } else {
        done(null, false);
      }
    }
    done(null, false);
  }
}

@Injectable()
export class refreshJwtStrategy extends PassportStrategy(
  Strategy,
  "jwtRefresh"
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,

      jsonWebTokenOptions: {
        maxAge: 30 * 24 * 60 * 60,
      },
    });
  }
  async validate(payload: any, done) {
    const jti = await this.prisma.token.findFirst({
      where: {
        id: payload.id,
        valid: true,
      },
    });
    if (jti) {
      const user = await this.prisma.user.findFirst({
        where: { id: payload.userId },
        include: {
          jobPosition: true,
          department: true,
        },
      });

      if (user) {
        const roles = await this.prisma.roles.findMany({
          where: {
            jobPositionId: user.jobPositionId,
            departmentId: user.departmentId,
          },
          select: {
            feature: true,
          },
        });
        done(null, {
          ...user,
          roles: roles,
          jti: payload.jti,
          refresh: payload.refresh || false,
        });
      } else {
        done(null, false);
      }
    }
    done(null, false);
  }
}
