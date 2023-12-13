import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ResponseController } from "src/util/response.controller";
import { ChangePassword } from "./dto/changePassword.dto";
import { refreshJwtStrategy } from "src/auth/stratiges/jwt.stratgy";
import { PrismaService } from "prisma.service";
import { tokenService } from "../auth/token.service";
import { MailService } from "src/mail/mail.service";
import * as speakeasy from "speakeasy";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService,
    private mail: MailService,
    private refresh: refreshJwtStrategy
  ) {}
  // change password of user if he login for first time or not
  async changePassword(res, id, changePassword) {
    const { password } = changePassword;
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
    await this.prisma.user.update({
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

  // take email to send id
  async forgetPassword(res, forgetPassword) {
    const { email } = forgetPassword;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
        id: true,
        first: true,
        active: true,
      },
    });
    // if user donot exist send verification mail

    if (!user) {
      return ResponseController.badRequest(
        res,
        "Email not found",
        "email not found"
      );
    }
    // if user first time

    if (user["first"] || !user["active"]) {
      return ResponseController.forbidden(res, "connect to admin please");
    }

    // if user exist send verification mail
    const secret = speakeasy.generateSecret().base32;

    const code = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    await this.mail.sendUserConfirmation(
      user["name"],
      user["email"],
      code.toString(),
      "confirmation"
    );
    await this.prisma.secret.create({
      data: {
        userId: user["id"],
        code: code.toString(),
      },
    });
    return ResponseController.success(res, "signed In successfully", {
      user: { id: user["id"], email: user["email"] },
    });
  }

  //verify code
  async verify(res, id, verifyDto) {
    const { code } = verifyDto;
    const exist = await this.prisma.secret.findUnique({
      where: {
        userId: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(
        res,
        "user not available to change password"
      );
    }

    if (exist.code !== code) {
      return ResponseController.badRequest(res, "Invalid Code", "Invalid Code");
    }

    await this.prisma.secret.deleteMany({
      where: {
        userId: id,
      },
    });
    return ResponseController.success(res, "Email Verified Successfully", id);
  }
  async addUser(res, data) {
    const { email, name } = data;
    const hashPassword = await bcrypt.hash("password", 8);
    await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        departmentId: "031a913f-904f-11ee-84d9-005056c00001",
        jobPositionId: "badf9285-904e-11ee-84d9-005056c00001",
      },
    });
    return ResponseController.success(res, "add User successfuly", null);
  }
}
