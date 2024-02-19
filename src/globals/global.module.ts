import { Global, Module } from "@nestjs/common";
import { ResponseService } from "./services/response.service";
import { PrismaService } from "./services/prisma.service";
// import { MailService } from './services/mail.service';
@Global()
@Module({
  imports: [],
  providers: [ResponseService, PrismaService],
  exports: [ResponseService, PrismaService],
})
export class GlobalModule {}
