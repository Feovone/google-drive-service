import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { AppConfigService } from '../../../../app-config/app-config.service';
import { GDriveClient } from '../../../integrations/clients/gdrive.client';
import { FilesService } from '../../services/files.service';
import { UploadFilesFromLinksCommand } from '../upload-files-from-links.command';

@CommandHandler(UploadFilesFromLinksCommand)
export class UploadFilesFromLinksHandler
  implements ICommandHandler<UploadFilesFromLinksCommand>
{
  constructor(
    private readonly configService: AppConfigService,
    private readonly filesService: FilesService,
    private readonly gDriveClient: GDriveClient,
  ) {}

  async execute(command: UploadFilesFromLinksCommand): Promise<any[]> {
    const { urls } = command;
    const results = [];

    for (const url of urls) {
      results.push(await this.processOneUrl(url));
    }

    return results;
  }

  private async processOneUrl(originalUrl: string) {
    try {
      const { stream, mimeType, fileName } =
        await this.filesService.fetchFileFromUrl(originalUrl);
      const driveId = await this.gDriveClient.uploadStreamToDrive(
        stream,
        fileName,
        mimeType,
      );

      if (this.configService.googleDriveConfig.makeNewPublic) {
        await this.gDriveClient.makeFilePublic(driveId);
      }

      return await this.filesService.saveSuccess(
        originalUrl,
        driveId,
        fileName,
        mimeType,
      );
    } catch (error) {
      return this.filesService.saveFailure(originalUrl, error.message);
    }
  }
}
