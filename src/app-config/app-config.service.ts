import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type DataSourceOptions } from 'typeorm';

import { SnakeNamingStrategy } from './snake-naming.strategy';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get postgresConfig(): DataSourceOptions {
    const entities = [
      path.join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}'),
    ];
    const migrations = [
      path.join(__dirname, '..', 'database', 'migrations', '*.{ts,js}'),
    ];

    return {
      entities,
      migrations,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      synchronize: this.getBoolean('ENABLE_SCHEMA_SYNC'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
      host: this.getString('HOST'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      throw new TypeError(key + ' environment variable is not a number');
    }

    return Number(value);
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll('\\n', '\n');
  }

  private getArray(key: string): string[] {
    const raw = this.get(key);

    try {
      return JSON.parse(raw).map((v: string) => v.replaceAll('\\n', '\n'));
    } catch (error) {
      throw new Error(
        `Invalid JSON array in env for key "${key}": ${error.message}`,
      );
    }
  }
}
