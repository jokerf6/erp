import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { MediaService } from "./media.service";
import { Auth } from "src/auth/decorators/auth.decorator";

@Controller("media")
@ApiTags("Media")
export class MediaController {
  constructor(private mediaService: MediaService) {}
  @Auth({})
  @Get("/")
  async returnMedia(@Res() res: Response, @Query("media") media: string) {
    await this.mediaService.isMediaExist(media.replace("uploads", ""));
    return res.sendFile(media.replace("uploads", ""), {
      root: process.env.UPLOADS_PATH,
    });
  }
}
