import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from './keycloak/keycloak.module';
import { UsersController } from './controllers/users.controller';
import { RealmsController } from './controllers/realms.controller';
import { GroupsController } from './controllers/groups.controller';
import { RolesController } from './controllers/roles.controller';
import { ClientsController } from './controllers/clients.controller';
import { ResourcesController } from './controllers/resources.controller';
import { ScopesController } from './controllers/scopes.controller';
import { PoliciesController } from './controllers/policies.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { ClientRolesController } from './controllers/client-roles.controller';
import { KeycloakExceptionFilter } from './keycloak/keycloak-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KeycloakModule,
  ],
  controllers: [
    AppController,
    UsersController,
    RealmsController,
    GroupsController,
    RolesController,
    ClientsController,
    ResourcesController,
    ScopesController,
    PoliciesController,
    PermissionsController,
    ClientRolesController,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: KeycloakExceptionFilter,
    },
  ],
})
export class AppModule { }
