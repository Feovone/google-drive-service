import { type Readable } from 'node:stream';

import { Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';

import { AppConfigService } from '../../../app-config/app-config.service';
import Drive = drive_v3.Drive;

@Injectable()
export class GDriveClient {
  private drive: Drive;

  constructor(private readonly configService: AppConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.configService.googleDriveConfig.credentialsPath,
      scopes: this.configService.googleDriveConfig.scopes,
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async getFolderIdByName(folderName: string): Promise<string> {
    const list = await this.drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name)',
    });
    const existing = list.data.files?.[0];

    if (existing) {
      return existing.id;
    }

    return null;
  }

  async createFolder(folderName: string): Promise<string> {
    const createRes = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    return createRes.data.id;
  }

  async uploadStreamToDrive(
    stream: Readable,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    const metadata: any = {
      name: fileName,
    };

    const parentId = await this.resolveParentFolderId();

    if (parentId) {
      metadata.parents = [parentId];
    }

    const res = await this.drive.files.create({
      requestBody: metadata,
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id',
    });

    return res.data.id;
  }

  async makeFilePublic(fileId: string): Promise<void> {
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        type: 'anyone',
        role: 'reader',
      },
      fields: 'id',
    });
  }

  private async resolveParentFolderId(): Promise<string | null> {
    const { folderId, folderName } = this.configService.googleDriveConfig;

    if (folderId) {
      return folderId;
    }

    if (folderName) {
      let resolvedFolderId = await this.getFolderIdByName(folderName);

      if (!resolvedFolderId) {
        resolvedFolderId = await this.createFolder(folderName);
      }

      return resolvedFolderId;
    }

    return null;
  }
}
