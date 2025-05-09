import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  type NestExpressApplication,
} from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: false },
  );

  const configService = app.select(AppConfigModule).get(AppConfigService);
  await app.listen(configService.appConfig.port, configService.appConfig.host);
  console.info(`server running on ${await app.getUrl()}`);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void bootstrap();
