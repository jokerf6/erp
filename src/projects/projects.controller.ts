import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { RolesGuard } from "src/auth/decorators/roles.decorator";
import { features } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { addProject } from "./dto/addProject.dto";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@Controller("projects")
@ApiTags("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Auth({})
  @Get("/")
  getProjects(
    @Res() res: Response,
    @CurrentUser("departmentId") departmentId: string,
    @RolesGuard(features.GET_PROJECTS) {}
  ) {
    return this.projectsService.getProjects(res, departmentId);
  }
  @Auth({})
  @Post("/")
  addProject(
    @Res() res: Response,
    @Body() AddProject: addProject,
    @RolesGuard(features.ADD_PROJECTS) {}
  ) {
    return this.projectsService.AddProject(res, AddProject);
  }
}
