import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreatePermissionDto, AssignPermissionToRoleDto } from './dto/authorization.dto';

@ApiTags('Client Permissions (Authorization)')
@Controller('clients/:clientId/permissions')
export class PermissionsController {
  constructor(private readonly keycloak: KeycloakService) {}

  @Get()
  @ApiOperation({ summary: 'List all authorization permissions for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiResponse({ status: 200, description: 'List of permissions.' })
  async findAll(@Param('clientId') clientId: string) {
    return this.keycloak.clients.listPermissions({ id: clientId });
  }

  @Get(':permissionId')
  @ApiOperation({ summary: 'Get a specific authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'permissionId', description: 'Internal ID of the permission' })
  @ApiResponse({ status: 200, description: 'Permission found.' })
  async findOne(
    @Param('clientId') clientId: string,
    @Param('permissionId') permissionId: string,
  ) {
    const permissions = await this.keycloak.clients.listPermissions({ id: clientId, permissionId: permissionId } as any);
    return permissions.length > 0 ? permissions[0] : null;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: 'Permission created successfully.' })
  async create(
    @Param('clientId') clientId: string,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return this.keycloak.clients.createPermission(
      { id: clientId, type: createPermissionDto.type },
      createPermissionDto,
    );
  }

  @Put(':permissionId')
  @ApiOperation({ summary: 'Update an authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'permissionId', description: 'Internal ID of the permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 200, description: 'Permission updated successfully.' })
  async update(
    @Param('clientId') clientId: string,
    @Param('permissionId') permissionId: string,
    @Body() updateDto: CreatePermissionDto,
  ) {
    return this.keycloak.clients.updatePermission(
      { id: clientId, type: updateDto.type, permissionId: permissionId },
      updateDto,
    );
  }

  @Delete(':permissionId')
  @ApiOperation({ summary: 'Delete an authorization permission for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'permissionId', description: 'Internal ID of the permission' })
  @ApiQuery({ name: 'type', required: true, description: 'Type of the permission to delete (resource or scope)' })
  @ApiResponse({ status: 204, description: 'Permission deleted successfully.' })
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
  @ApiResponse({ status: 201, description: 'Role Policy and Permission created successfully.' })
  async assignToRole(
    @Param('clientId') clientId: string,
    @Body() dto: AssignPermissionToRoleDto,
  ) {
    // 1. Create a Role Policy wrapper for the role
    const rolePolicyPayload = {
      name: dto.policyName,
      type: 'role',
      logic: 'POSITIVE' as const,
      roles: [{ id: dto.roleId }],
    };
    await this.keycloak.clients.createPolicy({ id: clientId, type: 'role' }, rolePolicyPayload);

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
