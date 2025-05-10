import * as path from 'node:path';
import { URL } from 'node:url';

import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { AppConfigService } from '../../../app-config/app-config.service';
import { FileValidationErrors } from '../constants/file-validation.errors';

@Injectable()
export class FileValidatorService {
  private readonly maxSize: number;

  private readonly allowedMime: string[];

  private readonly blockedMime: string[] = [
    'application/javascript',
    'application/x-msdownload',
    'application/x-sh',
    'application/x-bash',
  ];

  //add if needed
  private readonly allowedHosts: string[] = [];

  constructor(private readonly configService: AppConfigService) {
    this.maxSize = this.configService.fileValidationConfig.maxUploadSize;
  }

  async checkFileSize(url: string): Promise<void> {
    const head = await axios.head(url, { timeout: 5000 });
    const contentLength = Number.parseInt(head.headers['content-length'], 10);

    if (Number.isNaN(contentLength)) {
      throw FileValidationErrors.unknownFileSize();
    }

    if (contentLength > this.maxSize) {
      throw FileValidationErrors.fileTooLarge(this.maxSize);
    }
  }

  validateMimeType(mimeType: string): void {
    if (this.blockedMime.includes(mimeType)) {
      throw FileValidationErrors.blockedMime(mimeType);
    }

    if (this.allowedMime && !this.allowedMime.includes(mimeType)) {
      throw FileValidationErrors.unsupportedMime(mimeType);
    }
  }

  sanitizeFileName(raw: string): string {
    const name = path.basename(raw || '');

    return name.replaceAll(/[^\w.-]/g, '_');
  }

  async getFinalUrl(url: string): Promise<string> {
    try {
      await axios.head(url, {
        maxRedirects: 0,
      });

      return url;
    } catch (error: any) {
      if (error.response?.status >= 300 && error.response?.status < 400) {
        throw FileValidationErrors.redirectDetected();
      }

      throw FileValidationErrors.dnsFailed();
    }
  }

  isAllowedHost(url: string): boolean {
    const { hostname } = new URL(url);

    if (this.allowedHosts.length === 0) {
      return true;
    }

    return this.allowedHosts.includes(hostname);
  }
}
