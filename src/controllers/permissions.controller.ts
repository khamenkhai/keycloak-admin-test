import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { AssignPermissionToRoleDto } from './dto/authorization.dto';
import { Logic } from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import { CreatePermissionDto } from './dto/permission.dto';

@ApiTags('Client Permissions (Authorization)')
@Controller('clients/:clientId/permissions')
export class PermissionsController {
  constructor(private readonly keycloak: KeycloakService) { }

  @Get()
  @ApiOperation({ summary: 'List all authorization permissions for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  async findAll(@Param('clientId') clientId: string) {
    return this.keycloak.clients.findPermissions({ id: clientId });

  }

  @Get(':permissionId')
  @ApiOperation({ summary: 'Get a specific authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'permissionId', description: 'Internal ID of the permission' })
  async findOne(
    @Param('clientId') clientId: string,
    @Param('permissionId') permissionId: string,
  ) {
    const permissions = await this.keycloak.clients.findPermissions({ id: clientId, permissionId: permissionId } as any);
    return permissions.length > 0 ? permissions[0] : null;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: CreatePermissionDto })
  async create(
    @Param('clientId') clientId: string,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    const { type, name, resources, scopes, policies, description } = createPermissionDto;

    return this.keycloak.clients.createPermission(
      { id: clientId, type: type }, // 'type' here is 'resource' or 'scope'
      {
        name,
        description,
        resources: resources || [], // Array of Resource UUIDs
        scopes: scopes || [],       // Array of Scope UUIDs
        policies: policies || [],   // Array of Policy UUIDs
        // logic: Logic.POSITIVE, (Optional: Defaults to POSITIVE)
        // decisionStrategy: DecisionStrategy.UNANIMOUS, (Optional)
      },
    );
  }

  @Put(':permissionId')
  @ApiOperation({ summary: 'Update an authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'permissionId', description: 'Internal ID of the permission' })
  @ApiBody({ type: CreatePermissionDto })
  async update(
    @Param('clientId') clientId: string,
    @Param('permissionId') permissionId: string,
    @Body() updateDto: CreatePermissionDto,
  ) {
    return this.keycloak.clients.updatePermission(
      { id: clientId, type: updateDto.type, permissionId: permissionId },
      updateDto as any,
    );
  }

  @Delete(':permissionId')
  @ApiOperation({ summary: 'Delete an authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'permissionId', description: 'Internal ID of the permission' })
  @ApiQuery({ name: 'type', required: true, description: 'Type of the permission to delete (resource or scope)' })
  async remove(
    @Param('clientId') clientId: string,
    @Param('permissionId') permissionId: string,
    @Query('type') type: string,
  ) {
    return this.keycloak.clients.delPermission({ id: clientId, type: type, permissionId: permissionId });
  }

  @Post('assign-role')
  @ApiOperation({ summary: 'Assign a new permission to a specific client role' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: AssignPermissionToRoleDto })
  async assignToRole(
    @Param('clientId') clientId: string,
    @Body() dto: AssignPermissionToRoleDto,
  ) {
    // 1. Create a Role Policy wrapper for the role
    const rolePolicyPayload = {
      name: dto.policyName,
      type: 'role',
      logic: Logic.POSITIVE,
      roles: [{ id: dto.roleId }],
    };
    await this.keycloak.clients.createPolicy({ id: clientId, type: 'role' }, {
      name: dto.policyName,
      type: 'role',
      logic: Logic.POSITIVE,
      roles: [{ id: dto.roleId }],
    });

    // 2. Filter resources or scopes based on the permission type
    const resources = dto.permissionType === 'resource' && dto.resources ? dto.resources : undefined;
    const scopes = dto.permissionType === 'scope' && dto.scopes ? dto.scopes : undefined;

    // 3. Create the actual permission and tie it to the policy we just created
    const permissionPayload = {
      name: dto.permissionName,
      type: dto.permissionType,
      logic: 'POSITIVE' as const,
      decisionStrategy: 'UNANIMOUS' as const,
      policies: [dto.policyName],
      resources,
      scopes,
    };

    return this.keycloak.clients.createPermission(
      { id: clientId, type: dto.permissionType },
      permissionPayload as any,
    );
  }
}
