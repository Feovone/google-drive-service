import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UploadFilesFromLinksCommand } from '../commands/upload-files-from-links.command';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { GetFilesQuery } from '../queries/get-files.query';

@Controller('files')
export class FilesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('upload-from-links')
  async uploadFiles(
    @Body(new ValidationPipe({ transform: true })) dto: UploadFileDto,
  ) {
    return this.commandBus.execute(new UploadFilesFromLinksCommand(dto.urls));
  }

  @Get()
  async getFiles() {
    return this.queryBus.execute(new GetFilesQuery());
  }
}
