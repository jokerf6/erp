import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MailModule } from "./mail/mail.module";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { ConfigModule } from "@nestjs/config";
import { MediaModule } from "./media/media.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    MailModule,
    TasksModule,
    ProjectsModule,
    MediaModule,
    ConfigModule.forRoot({
      envFilePath: ".env", // Specify the path to your .env file
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
