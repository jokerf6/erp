import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "prisma.service";
import { ResponseController } from "src/util/response.controller";
import { AddTask } from "./dto/addTask.dto";
import { taskStatus } from "@prisma/client";
import { HandelFiles } from "src/media/helpers/handel-files";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(res: any, userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        taskAssignees: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        brief: true,
        status: true,
        priority: true,
        _count: {
          select: {
            TaskComments: true,
            TaskFiles: true,
          },
        },
        taskAssignees: {
          select: {
            user: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    return ResponseController.success(res, "Get Data Successfully", tasks);
  }

  async getTask(res: any, userId: string, id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        brief: true,
        status: true,
        taskAssignees: {
          select: {
            user: {
              select: {
                name: true,
                jobPosition: {
                  select: {
                    name: true,
                  },
                },
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            TaskComments: true,
            TaskFiles: true,
          },
        },
      },
    });
    return ResponseController.success(res, "Get Data Successfully", task);
  }
  async addTask(res: any, addTask: AddTask, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        name: addTask.name,
        projectId: addTask.projectId,
        dueDate: addTask.dueData,
        priority: addTask.priority,
        brief: addTask.description,
        status: taskStatus.ToDo,
      },
    });
    for (let i = 0; i < addTask.AssigneesId.length; i++) {
      await this.prisma.taskAssignees.create({
        data: {
          taskId: task.id,
          userId: addTask.AssigneesId[i],
        },
      });
    }
    await this.prisma.taskAssignees.create({
      data: {
        taskId: task.id,
        userId,
        admin: true,
      },
    });
    return ResponseController.success(res, "add Task Successfully", null);
  }
  async editTask(res: any, addTask: AddTask, id: string) {
    const task = await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        name: addTask.name,
        projectId: addTask.projectId,
        dueDate: addTask.dueData,
        priority: addTask.priority,
        brief: addTask.description,
        status: taskStatus.ToDo,
      },
    });
    for (let i = 0; i < addTask.AssigneesId.length; i++) {
      await this.prisma.taskAssignees.create({
        data: {
          taskId: task.id,
          userId: addTask.AssigneesId[i],
        },
      });
    }
    return ResponseController.success(res, "add Task Successfully", null);
  }

  async validateUnique(id?: string, name?: string) {
    if (!name) {
      const exist = await this.prisma.task.findUnique({
        where: {
          id,
        },
      });
      if (!exist) return false;
      else return true;
    } else {
      const exist = await this.prisma.task.findFirst({
        where: {
          name,
        },
      });
      if (!exist) return false;
      else return true;
    }
  }
  async addComment(res: any, userId: string, addComment: any, id: string) {
    await this.prisma.taskComments.create({
      data: {
        userId,
        taskId: id,
        text: addComment.text,
      },
    });
    return ResponseController.success(res, "add comment Successfully", null);
  }
  async deleteTask(res: any, id: string) {
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
    return ResponseController.success(res, "Delete Task Successfully", null);
  }
  async deleteComment(res: any, id: string) {
    await this.prisma.taskComments.delete({
      where: {
        id,
      },
    });
    return ResponseController.success(res, "Delete Comment Successfully", null);
  }
  async validateUniqueComments(id: string, userId: string) {
    const comment = await this.prisma.taskComments.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException("comment not found");
    if (comment.userId !== userId)
      throw new ForbiddenException(
        "you don't have permission to delete this comment"
      );
  }

  async editTaskStatus(
    res: any,
    editTaskStatus: any,
    id: string,
    userId: string
  ) {
    const users = await this.prisma.taskAssignees.findMany({
      select: { userId: true },
    });
    const exist = users.filter((item: any) => item.userId === userId);
    if (!exist) {
      throw new ForbiddenException("you cannot update this task");
    }
    await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        status: editTaskStatus,
      },
    });
    return ResponseController.success(res, "update data Successfully", null);
  }

  async AddFile(res: any, file: any, id: string, addFile: any) {
    const handelFiles = new HandelFiles(id);
    HandelFiles.generatePath(file, addFile, id);

    handelFiles.handelFileTemp(file);
    const { idImage } = addFile;
    console.log(idImage);
    console.log(file);
    await this.prisma.taskFiles.create({
      data: {
        taskId: id,
        name: file.originalname,
        file: idImage,
      },
    });
    return ResponseController.success(res, "add File Successfully", null);
  }
}
