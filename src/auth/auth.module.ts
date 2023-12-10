import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../../prisma.service";
import { tokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtStrategy, refreshJwtStrategy } from "./stratiges/jwt.stratgy";
import { MailService } from "src/mail/mail.service";

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: 1 * 24 * 60 * 60 },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    tokenService,
    jwtStrategy,
    MailService,
    refreshJwtStrategy,
  ],
})
export class AuthModule {}
