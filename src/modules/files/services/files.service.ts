import { randomBytes } from 'node:crypto';
import { type Readable } from 'node:stream';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

import { AppConfigService } from '../../../app-config/app-config.service';
import { FileValidationErrors } from '../constants/file-validation.errors';
import { FileEntity, FileStatus } from '../entities/file.entity';
import { FileValidatorService } from './file-validator.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repo: Repository<FileEntity>,
    private readonly configService: AppConfigService,
    private readonly fileValidator: FileValidatorService,
  ) {}

  async fetchFileFromUrl(
    url: string,
  ): Promise<{ stream: Readable; mimeType: string; fileName: string }> {
    await this.validateLinkBefore(url);
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 600_000,
      maxContentLength: this.configService.fileValidationConfig.maxUploadSize,
      maxBodyLength: this.configService.fileValidationConfig.maxUploadSize,
    });

    const fileName = this.fileValidator.sanitizeFileName(
      url.split('/').pop() || '',
    );
    const mimeType = response.headers['content-type'];
    this.fileValidator.validateMimeType(mimeType);

    return {
      stream: response.data as Readable,
      mimeType,
      fileName,
    };
  }

  async saveSuccess(
    originalUrl: string,
    driveId: string,
    fileName: string,
    mimeType: string,
  ) {
    const file = this.repo.create({
      originalUrl,
      driveId,
      fileName,
      mimeType,
      status: FileStatus.SUCCESS,
    });

    return this.repo.save(file);
  }

  async saveFailure(originalUrl: string, error: string) {
    const file = this.repo.create({
      originalUrl,
      status: FileStatus.FAILED,
      error,
    });

    return this.repo.save(file);
  }

  async getAll(): Promise<FileEntity[]> {
    const template = this.configService.googleDriveConfig.linkTemplate;

    if (!template.includes('{driveId}')) {
      throw FileValidationErrors.invalidDriveTemplate();
    }

    const [prefix, suffix] = template.split('{driveId}');

    return this.repo
      .createQueryBuilder('file')
      .select([
        'file.id AS id',
        'file.fileName AS "fileName"',
        'file.mimeType AS "mimeType"',
        'file.status AS status',
        'file.driveId AS "driveId"',
        'file.createdAt AS "createdAt"',
        `CONCAT('${prefix}', file.driveId, '${suffix}') AS "url"`,
      ])
      .where('file.status != :failStatus', { failStatus: FileStatus.FAILED })
      .getRawMany();
  }

  private async validateLinkBefore(url: string): Promise<void> {
    if (!this.fileValidator.isAllowedHost(url)) {
      throw FileValidationErrors.hostNotAllowed();
    }

    await this.fileValidator.checkFileSize(url);
    await this.fileValidator.getFinalUrl(url);
  }

  private getRandomFileName(): string {
    const randomStr = randomBytes(8).toString('hex');

    return `file-${randomStr}`;
  }
}
