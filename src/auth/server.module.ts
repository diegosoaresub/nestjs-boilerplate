import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from './auth.module';
import { DatabaseModule } from '../shared/database.module';
import { OidcModule } from './oidc/oidc.module';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/roles/entities/role.entity';
import { Status } from '../common/statuses/entities/status.entity';
import { Forgot } from './forgot/entities/forgot.entity';

@Module({
  imports: [
    SharedModule,
    DatabaseModule.forRoot([User, Role, Status, Forgot]),
    AuthModule,
    OidcModule,
  ],
})
export class AuthServerModule {}
