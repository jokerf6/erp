import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MediaService {
  constructor() {}
  async isMediaExist(media: string) {
    if (!fs.existsSync(`${process.env.UPLOADS_PATH}/${media}`)) {
      throw new NotFoundException("Media not found");
    }
    if (!fs.statSync(`${process.env.UPLOADS_PATH}/${media}`).isFile())
      throw new NotFoundException("Media not found");
  }

  async deleteTempFiles(rootDir: string): Promise<void> {
    try {
      const files = await fs.promises.readdir(rootDir);
      for (const file of files) {
        const filePath = path.join(rootDir, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
          await this.deleteTempFiles(filePath);
        } else {
          if (file.startsWith(env("TEMP_FILE_KEY"))) {
            await fs.promises.unlink(filePath);
          }
        }
      }
    } catch (error) {
      console.error(`Error deleting temp files: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleTempFiles() {
    await this.deleteTempFiles(process.env.UPLOADS_PATH);
  }
}
