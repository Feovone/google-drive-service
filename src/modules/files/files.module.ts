import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntegrationModule } from '../integrations/integrations.module';
import { UploadFilesFromLinksHandler } from './commands/handlers/upload-files-from-links.handler';
import { FilesController } from './controllers/files.controller';
import { FileEntity } from './entities/file.entity';
import { GetFilesHandler } from './queries/handlers/get-files.handler';
import { FileValidatorService } from './services/file-validator.service';
import { FilesService } from './services/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    IntegrationModule,
    CqrsModule,
  ],
  providers: [
    FilesService,
    UploadFilesFromLinksHandler,
    GetFilesHandler,
    FileValidatorService,
  ],
  controllers: [FilesController],
})
export class FilesModule {}
