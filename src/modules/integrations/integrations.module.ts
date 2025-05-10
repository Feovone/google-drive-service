import { Module } from '@nestjs/common';

import { AppConfigModule } from '../../app-config/app-config.module';
import { GDriveClient } from './clients/gdrive.client';

@Module({
  imports: [AppConfigModule],
  providers: [GDriveClient],
  exports: [GDriveClient],
})
export class IntegrationModule {}
