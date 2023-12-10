import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../../prisma.service";
import { refreshJwtStrategy } from "../auth/stratiges/jwt.stratgy";
import { tokenService } from "src/auth/token.service";
import { MailService } from "src/mail/mail.service";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    refreshJwtStrategy,
    tokenService,
    MailService,
  ],
})
export class UserModule {}
