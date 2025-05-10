import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsUrl } from 'class-validator';

export class UploadFileDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  @Type(() => String)
  urls: string[];
}
