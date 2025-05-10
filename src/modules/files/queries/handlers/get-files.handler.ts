import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type FileEntity } from '../../entities/file.entity';
import { FilesService } from '../../services/files.service';
import { GetFilesQuery } from '../get-files.query';

@QueryHandler(GetFilesQuery)
export class GetFilesHandler implements IQueryHandler<GetFilesQuery> {
  constructor(private readonly filesService: FilesService) {}

  async execute(): Promise<FileEntity[]> {
    return this.filesService.getAll();
  }
}
