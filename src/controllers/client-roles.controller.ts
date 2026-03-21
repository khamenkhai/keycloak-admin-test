import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Client Roles')
@Controller('clients/:clientId/roles')
export class ClientRolesController {
  constructor(private readonly keycloak: KeycloakService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles for a specific client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiResponse({ status: 200, description: 'List of client roles.' })
  async findAll(@Param('clientId') clientId: string) {
    return this.keycloak.clients.listRoles({ id: clientId });
  }

  @Get(':roleName')
  @ApiOperation({ summary: 'Get a specific role for a client by role name' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'roleName', description: 'Name of the role' })
  @ApiResponse({ status: 200, description: 'Client role found.' })
  async findOne(
    @Param('clientId') clientId: string,
    @Param('roleName') roleName: string,
  ) {
    return this.keycloak.clients.findRole({ id: clientId, roleName });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Client role created successfully.' })
  async create(
    @Param('clientId') clientId: string,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.keycloak.clients.createRole({ id: clientId, ...createRoleDto });
  }

  @Put(':roleName')
  @ApiOperation({ summary: 'Update a specific role for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'roleName', description: 'Name of the role to update' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 200, description: 'Client role updated successfully.' })
  async update(
    @Param('clientId') clientId: string,
    @Param('roleName') roleName: string,
    @Body() updateDto: CreateRoleDto,
  ) {
    return this.keycloak.clients.updateRole(
      { id: clientId, roleName },
      updateDto as any,
    );
  }

  @Delete(':roleName')
  @ApiOperation({ summary: 'Delete a specific role for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'roleName', description: 'Name of the role to delete' })
  @ApiResponse({ status: 204, description: 'Client role deleted successfully.' })
  async remove(
    @Param('clientId') clientId: string,
    @Param('roleName') roleName: string,
  ) {
    return this.keycloak.clients.delRole({ id: clientId, roleName });
  }
}
