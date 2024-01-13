import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  Res,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SignIn } from "./dto/signIn.dto";
import { Request, Response } from "express";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Signin user with email and password
  @Post("signin")
  @ApiCreatedResponse({
    description: "user signIn",
  })
  @ApiResponse({
    status: 200,
    description: "access Token",
    type: String,
  })
  @ApiBody({ type: SignIn })
  signin(@Body(ValidationPipe) dto: SignIn, @Res() res: Response) {
    return this.authService.signin(dto, res);
  }

  // create new accessToken with current refreshToken
  @ApiQuery({
    name: "refreshToken",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: "accessToken",
    type: String,
    required: true,
  })
  @Get("/accessToken")
  refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Query()
    query: {
      refreshToken: string;
      accessToken: string;
    }
  ) {
    return this.authService.refreshToken(req, res, query);
  }

  // password Dammy
  @Get("/getPassword")
  getPassword(@Res() res: Response) {
    return this.authService.getPassword(res);
  }
}
