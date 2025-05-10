import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';
import { FilesModule } from './modules/files/files.module';
import { IntegrationModule } from './modules/integrations/integrations.module';

@Module({
  imports: [
    NestConfig.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) =>
        configService.postgresConfig,
      inject: [AppConfigService],
    }),
    FilesModule,
    IntegrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
