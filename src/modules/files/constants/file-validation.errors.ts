import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export class FileValidationErrors {
  static blockedMime(mimeType: string) {
    return new UnsupportedMediaTypeException(`Blocked MIME type: ${mimeType}`);
  }

  static unsupportedMime(mimeType: string) {
    return new BadRequestException(`Unsupported MIME type: ${mimeType}`);
  }

  static fileTooLarge(maxSize: number) {
    return new PayloadTooLargeException(
      `File too large. Max: ${maxSize} bytes`,
    );
  }

  static unknownFileSize() {
    return new BadRequestException('Cannot determine file size');
  }

  static hostNotAllowed() {
    return new ForbiddenException('Host not allowed');
  }

  static ssrfBlocked() {
    return new ForbiddenException('Access to private IP is forbidden');
  }

  static redirectDetected() {
    return new BadRequestException('Redirects are not allowed');
  }

  static dnsFailed() {
    return new BadGatewayException('Cannot resolve host');
  }

  static invalidDriveTemplate() {
    return new BadRequestException(
      'GOOGLE_DRIVE_LINK_TEMPLATE must contain {driveId}',
    );
  }
}
