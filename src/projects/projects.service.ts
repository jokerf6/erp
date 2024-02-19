import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma.service";
import { ResponseController } from "src/util/response.controller";
import { addProject } from "./dto/addProject.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjects(res: any, departmentId: string) {
    const projects = await this.prisma.project.findMany({ where: {} });
    return ResponseController.success(res, "Get data Successfully", [projects]);
  }
  async AddProject(res: any, data: addProject) {
    await this.prisma.project.create({
      data: data,
    });
    return ResponseController.success(res, "Get data Successfully", null);
  }
}
