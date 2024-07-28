import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { generatePasswordWithSecretsManager } from './utils/generatePasswordWithSecretsManager';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    console.log({
      type: this.configService.get('database.type'),
      url: this.configService.get('database.url'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      localDevelopment: this.configService.get('database.localDevelopment'),
    });

    let password: string;
    if (this.configService.get('app.localDevelopment') === 'true') {
      password = this.configService.get('database.password')
    } else {
      console.log('Retrieve password via Secrets Manager')
      password = await generatePasswordWithSecretsManager(this.configService.get('database.secretName'));
    }

    return {
      type: this.configService.get('database.type'),
      url: this.configService.get('database.url'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: password,
      database: this.configService.get('database.name'),
      synchronize: this.configService.get('database.synchronize'),
      dropSchema: false,
      keepConnectionAlive: false,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      ssl: this.configService.get('database.sslEnabled'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: this.configService.get('database.sslEnabled')
        ? {
          sslmode: 'verify-full',
          sslrootcert: __dirname + '/certs/rds-combined-ca-bundle.pem',
        }
        : {},
    } as PostgresConnectionOptions;
  }
}
