import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './../../config/app.config';
import databaseConfig from './../../config/database.config';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { DatabaseModule } from '../../../shared/database.module';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { Forgot } from '../../../auth/forgot/entities/forgot.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule.forRoot([User, Role, Status, Forgot]),
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
  ],
})
export class SeedModule {}
