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
import { ForgetPassword } from "./dto/forgetPassword.dto";
import { Verify } from "./dto/verifyCode.dto";
import { AddUser } from "./dto/addUser.dto";
@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // add user
  @Post("/")
  addUser(
    @Res() res: Response,
    @Body(ValidationPipe)
    addUser: AddUser
  ) {
    return this.userService.addUser(res, addUser);
  }

  // send email to change password
  @Post("/forget_password")
  forgetPassword(
    @Res() res: Response,
    @Body(ValidationPipe)
    forgetPassword: ForgetPassword
  ) {
    return this.userService.forgetPassword(res, forgetPassword);
  }

  // change password of user
  @Post("/:id/change_password")
  editPassword(
    @Param("id") id: string,
    @Res() res: Response,
    @Body(ValidationPipe)
    changePassword: ChangePassword
  ) {
    return this.userService.changePassword(res, id, changePassword);
  }

  // verify code
  @Post("/:id/verify_code")
  verifyCode(
    @Res() res: Response,
    @Param("id") id: string,
    @Body(ValidationPipe)
    verify: Verify
  ) {
    return this.userService.verify(res, id, verify);
  }
}
