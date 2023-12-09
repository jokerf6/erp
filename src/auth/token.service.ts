import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class tokenService {
  constructor(private prisma: PrismaService) {}
  async createAccess(user: any, refreshId: string) {
    const tokenId = await this.prisma.token.create({
      data: {
        userId: user.id,
        type: "AccessToken",
        refreshId,
      },
    });
    const accessToken = jwt.sign(
      { userId: user.id, id: tokenId.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 1 * 24 * 60 * 60 }
    );
    return accessToken;
  }
  async createRefresh(user: any) {
    const tokenId = await this.prisma.token.create({
      data: {
        userId: user.id,
        type: "RefreshToken",
      },
    });
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        id: tokenId,
        role: user.role,
        type: "RefreshToken",
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 30 * 24 * 60 * 60 }
    );
    return { refreshToken, refreshId: tokenId.id };
  }
}
