import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { features, taskStatus } from "@prisma/client";
import { AppService } from "src/app.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { RolesGuard } from "src/auth/decorators/roles.decorator";
import { ApiRequiredIdParam } from "src/decorators/params/id-params.decorator";
import { RequiredIdParam } from "src/dtos/id-param.dto";
import { ResponseController } from "src/util/response.controller";
import { AddComment } from "./dto/addComments";
import { AddTask } from "./dto/addTask.dto";
import { EnumArrayFilter } from "src/decorators/filters/enum.filter.decorator";
import { Status, editTaskStatus } from "./dto/updateTaskStatus";
import { UploadImage } from "src/media/decorators/upload.decorator";
import { uploadPath } from "../media/configs/upload.config";
import { AddFile } from "./dto/addFile.dto";

@Controller("tasks")
@ApiTags("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Auth({})
  @Get("/")
  getTasks(@Res() res: any, @CurrentUser("id") userId: string) {
    return this.tasksService.getTasks(res, userId);
  }
  @Auth({})
  @Post("/")
  addTask(
    @Res() res: any,
    @Body() addTask: AddTask,
    @RolesGuard(features.ADD_TASKS) {},
    @CurrentUser("id") userId: string
  ) {
    return this.tasksService.addTask(res, addTask, userId);
  }
  @Auth({})
  @Post("/:id/file")
  @UploadImage(uploadPath.users, "idImage")
  @ApiRequiredIdParam()
  addFile(
    @Res() res: any,
    @UploadedFile() file: Express.Multer.File,
    @RolesGuard(features.GET_TASKS) {},
    @Param() { id }: RequiredIdParam,
    @Body() addFile: AddFile
  ) {
    if (!this.tasksService.validateUnique(id)) {
      throw new NotFoundException("This id Not found");
    }
    return this.tasksService.AddFile(res, file, id, addFile);
  }
  @Auth({})
  @Patch("/:id")
  @ApiRequiredIdParam()
  editTask(
    @Res() res: any,
    @Body() addTask: AddTask,
    @Param() { id }: RequiredIdParam,

    @RolesGuard(features.ADD_TASKS) {}
  ) {
    if (!this.tasksService.validateUnique(id)) {
      throw new NotFoundException("This id Not found");
    }
    return this.tasksService.editTask(res, addTask, id);
  }
  @Auth({})
  @Patch("/:id/status")
  @ApiRequiredIdParam()
  @ApiQuery({
    name: "status",
    enum: taskStatus,
  })
  editTaskStatus(
    @Res() res: any,
    @Param() { id }: RequiredIdParam,
    @CurrentUser("id") userId: string,
    @Query("status") status: Status // Extract the 'status' query parameter
  ) {
    if (!this.tasksService.validateUnique(id)) {
      throw new NotFoundException("This id Not found");
    }
    return this.tasksService.editTaskStatus(res, status, id, userId);
  }
  @Auth({})
  @Delete("/:id")
  @ApiRequiredIdParam()
  deleteTask(
    @Res() res: any,
    @Param() { id }: RequiredIdParam,
    @RolesGuard(features.DELETE_TASKS) {}
  ) {
    if (!this.tasksService.validateUnique(id)) {
      throw new NotFoundException("This id Not found");
    }
    return this.tasksService.deleteTask(res, id);
  }
  @Auth({})
  @Get("/:id")
  @ApiRequiredIdParam()
  getTask(
    @Res() res: any,
    @CurrentUser("id") userId: string,
    @Param() { id }: RequiredIdParam
  ) {
    if (!this.tasksService.validateUnique(id)) {
      throw new NotFoundException("This id Not found");
    }
    return this.tasksService.getTask(res, userId, id);
  }
  @Auth({})
  @Post("/:id/comment")
  @ApiRequiredIdParam()
  addComment(
    @Res() res: any,
    @CurrentUser("id") userId: string,
    @Body() addComment: AddComment,
    @Param() { id }: RequiredIdParam
  ) {
    if (!this.tasksService.validateUnique(id)) {
      throw new NotFoundException("This id Not found");
    }
    return this.tasksService.addComment(res, userId, addComment, id);
  }
  @Auth({})
  @Delete("/comment/:id")
  @ApiRequiredIdParam()
  deleteComment(
    @Res() res: any,
    @CurrentUser("id") userId: string,
    @Param() { id }: RequiredIdParam
  ) {
    this.tasksService.validateUniqueComments(id, userId);

    return this.tasksService.deleteComment(res, id);
  }
}
