import { MailService } from "../../src/mail/mail.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { tokenService } from "./token.service";
import { PrismaService } from "prisma.service";
import { refreshJwtStrategy } from "./stratiges/jwt.stratgy";
import { ResponseController } from "../../src/util/response.controller";
import { Response, response } from "express";
import { SignIn } from "./dto/signIn.dto";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let mailService: MailService;
  let tokenService: tokenService;
  let prismaService: PrismaService;
  let refresh: refreshJwtStrategy;
  beforeEach(() => {
    authService = new AuthService(
      prismaService,
      tokenService,
      refresh,
      mailService
    );
    authController = new AuthController(authService);
  });
});
