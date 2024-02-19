import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Auth } from "./auth/decorators/auth.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth({})
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
