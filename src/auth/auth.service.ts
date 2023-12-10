import { Injectable } from "@nestjs/common";
import { SignIn } from "./dto/signIn.dto";
import { PrismaService } from "../../prisma.service";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ResponseController } from "src/util/response.controller";
import { tokenService } from "./token.service";
import { refreshJwtStrategy } from "./stratiges/jwt.stratgy";
import { ApiTags } from "@nestjs/swagger";
import * as speakeasy from "speakeasy";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  ResponseService: any;
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService,
    private refresh: refreshJwtStrategy,
    private mail: MailService
  ) {}

  // Login user
  async signin(dto: SignIn, res) {
    const { workEmail, password } = dto;
    // check if user exist
    const userRes = await this.prisma.user.findFirst({
      where: {
        email: workEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        first: true,
        active: true,
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

    // Incorrect Email
    if (!userRes) {
      return ResponseController.badRequest(
        res,
        "bad incredentials",
        "Incorrect Email or Password"
      );
    }

    // Check Password
    const match = await bcrypt.compare(password, userRes.password);

    // Incorrect Password
    if (!match) {
      return ResponseController.badRequest(
        res,
        "bad incredentials",
        "Incorrect Email or Password"
      );
    }
    if (!userRes["active"]) {
      return ResponseController.forbidden(res, "you cannot login now");
    }

    // retuen data to front if user first time to change password
    if (userRes["first"]) {
      const secret = speakeasy.generateSecret().base32;

      const code = speakeasy.totp({
        secret:secret,
        digits: 5,
        encoding: "base32",
        step: 300,
      });
      await this.mail.sendUserConfirmation(
        userRes["name"],
        userRes["email"],
        code.toString(),
        "confirmation"
      );
      await this.prisma.secret.create({
        data: {
          userId: userRes["id"],
          code: code.toString(),
        }, 
      });
      return ResponseController.success(res, "signed In successfully", {
        user: userRes["id"],
      });
    }
    // create refresh token
    const refreshToken = await this.tokenServices.createRefresh(userRes);
    // create access token
    const accessToken = await this.tokenServices.createAccess(
      userRes,
      refreshToken.refreshId
    );

    // retuen data to front if user not first time
    return ResponseController.success(res, "signed In successfully", {
      user: {
        id: userRes["id"],
        name: userRes["name"],
        email: userRes["email"],
        first: userRes["first"],
        jobPosition: {
          id: userRes["jobPosition"]["id"],
          name: userRes["jobPosition"]["name"],
        },
        department: {
          id: userRes["department"]["id"],
          name: userRes["department"]["name"],
        },
      },
      accessToken,
      refreshToken: refreshToken.refreshToken,
    });
  }

  // refresh Access Token
  async refreshToken(req, res, query: any) {
    const { refreshToken, accessToken } = query;
    const x = accessToken;

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const decoded2 = jwt.verify(x, process.env.ACCESS_TOKEN_SECRET);
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decoded["exp"] && decoded["exp"] < currentTimestamp) {
        return ResponseController.notFound(res, "invalid token Or Expired");
      }

      if (decoded["type"] !== "RefreshToken") {
        return ResponseController.notFound(res, "invalid token Or Expired");
      }

      const refreshId = await this.prisma.token.findUnique({
        where: {
          id: decoded2["id"],
        },
      });
      const refreshOriginal = await this.prisma.token.findUnique({
        where: {
          id: refreshId.refreshId,
        },
      });

      if (refreshId.refreshId !== decoded["id"]["id"]) {
        return ResponseController.notFound(res, "invalid token Or Expired");
      }
      await this.prisma.token.delete({
        where: {
          id: decoded2["id"],
        },
      });
      const userRes = await this.prisma.user.findFirst({
        where: {
          id: decoded2["userId"],
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
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
      const accessToken = await this.tokenServices.createAccess(
        userRes,
        decoded["id"]["id"]
      );
      return ResponseController.success(res, "get data Successfully", {
        accessToken,
      });
    } catch (err) {
      return ResponseController.notFound(res, "invalid token Or Expired");
    }
  }
  async getPassword(res) {
    const hashPassword = await bcrypt.hash("password", 8);
    return ResponseController.success(res, "add", hashPassword);
  }
}
