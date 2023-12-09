import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  ValidationPipe,
  Param,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChangePassword } from "./dto/changePassword.dto";
import { Response } from "express";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  // change password of user
  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Post("/:id/change_password")
  editPassword(
    @Param("id") id: string,
    @Res() res: Response,
    @Body(ValidationPipe)
    changePassword: ChangePassword
  ) {
    return this.userService.changePassword(res, id, changePassword);
  }
}
