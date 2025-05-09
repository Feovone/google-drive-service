import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { AppConfigService } from '../app-config/app-config.service';

config();
const configService = new ConfigService();
const apiConfigService = new AppConfigService(configService);

export const ormConfig = new DataSource(apiConfigService.postgresConfig);
