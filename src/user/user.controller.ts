import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  ValidationPipe,
  Param,
  Get,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ChangePassword } from "./dto/changePassword.dto";
import { Response } from "express";
import { ForgetPassword } from "./dto/forgetPassword.dto";
import { Verify } from "./dto/verifyCode.dto";
import { AddUser } from "./dto/addUser.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { RolesGuard } from "src/auth/decorators/roles.decorator";
import { features } from "@prisma/client";
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
  // get all Users
  @Auth({})
  @Get("/users")
  getUsers(
    @Res() res: Response,
    @CurrentUser("departmentId") departmentId: string,
    @RolesGuard(features.GET_USERS) roles: any
  ) {
    return this.userService.getUsers(res, departmentId);
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
