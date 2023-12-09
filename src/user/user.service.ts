import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ResponseController } from "src/util/response.controller";
import { ChangePassword } from "./dto/changePassword.dto";
import { refreshJwtStrategy } from "src/auth/stratiges/jwt.stratgy";
import { PrismaService } from "prisma.service";
import { tokenService } from "../auth/token.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService,

    private refresh: refreshJwtStrategy
  ) {}
  // change password of user if he login for first time or not
  async changePassword(res, id, changePassword) {
    const { password, otp } = changePassword;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        first: true,
        jobPosition: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    // create Encrypted password
    const hashPassword = await bcrypt.hash(password, 8);

    // make user not first and send token
    if (user["first"]) this.firstUser(hashPassword, id, res);
    // change password
    else this.notFirstUser(hashPassword, id, res);
  }
  // change Password for First time
  async firstUser(hashPassword, id, res) {
    const profile = await this.prisma.user.update({
      data: {
        password: hashPassword,
        first: false,
      },
      where: {
        id,
      },
    });
    // create refresh token
    const refreshToken = await this.tokenServices.createRefresh(profile);
    // create access token
    const accessToken = await this.tokenServices.createAccess(
      profile,
      refreshToken.refreshId
    );

    return ResponseController.success(res, "Change Password Successfully", {
      user: {
        id: profile["id"],
        name: profile["name"],
        email: profile["email"],
        first: profile["first"],
        jobPosition: {
          id: profile["jobPosition"]["id"],
          name: profile["jobPosition"]["name"],
        },
        department: {
          id: profile["department"]["id"],
          name: profile["department"]["name"],
        },
      },
      accessToken,
      refreshToken: refreshToken.refreshToken,
    });
  }
  // change Password for users not first time
  async notFirstUser(hashPassword, id, res) {
    const profile = await this.prisma.user.update({
      data: {
        password: hashPassword,
      },
      where: {
        id,
      },
    });
    return ResponseController.success(
      res,
      "Change Password Successfully",
      null
    );
  }
}
