import { NestFactory } from "@nestjs/core";
import { SwaggerInit } from "./API/SwaggerConfig";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

import { PrismaService } from "prisma.service";
import { HttpExceptionFilter } from "./util/http-exception.filter";
const environment = process.env.NODE_ENV || "development";
const envFileName = environment == "production " ? ".env.prod" : ".env";
dotenv.config({ path: envFileName, override: true });
async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.setGlobalPrefix("/api");
  if (process.env.NODE_ENV === "development") {
    app.enableCors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "*",
    });
  }
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutDownHooks(app);
  SwaggerInit.init(app);

  await app.listen(5002);
  console.log(`Application is running on: ${process.env.PORT}`);
  console.log(`Swagger Docomentation On: ${await app.getUrl()}/api/v1/docs`);
}

bootstrap();
