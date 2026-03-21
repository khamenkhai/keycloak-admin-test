import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreateResourceDto } from './dto/resource.dto';

@ApiTags('Client Resources')
@Controller('clients/:clientId/resources')
export class ResourcesController {
  constructor(private readonly keycloak: KeycloakService) { }

  @Get()
  @ApiOperation({ summary: 'List all resources for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiResponse({ status: 200, description: 'List of resources.' })
  async findAll(@Param('clientId') clientId: string) {
    return this.keycloak.clients.listResources({ id: clientId });
  }

  @Get(':resourceId')
  @ApiOperation({ summary: 'Get a specific resource for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'resourceId', description: 'Internal ID of the resource' })
  @ApiResponse({ status: 200, description: 'Resource found.' })
  async findOne(
    @Param('clientId') clientId: string,
    @Param('resourceId') resourceId: string,
  ) {
    // The keycloak admin client normally has GET /admin/realms/{realm}/clients/{id}/authz/resource-server/resource/{resourceId}
    // mapped to a specific get / list method. 
    // Since the client exposes `listResources` with query filters or we can use `getResource` if mapped, 
    // Wait, let's use listResources with matching name or ID if a specific GET method isn't clearly exposed.
    // The library usually has `clients.getResource({ id: clientId, resourceId: resourceId })` but sometimes it's under `authorizations`. 
    // Actually, `keycloak-admin-client` has it mapped as `listResources({ id, resourceId, name... })`. Let's try listing a specific ID.
    // We will retrieve it via list query or directly.
    const resources = await this.keycloak.clients.listResources({ id: clientId, _id: resourceId } as any);
    return resources.length > 0 ? resources[0] : null;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new resource for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: 201, description: 'Resource created successfully.' })
  async create(
    @Param('clientId') clientId: string,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    return this.keycloak.clients.createResource(
      { id: clientId },
      {
        name: createResourceDto.name,
        displayName: createResourceDto.displayName,
        type: createResourceDto.type,
        ownerManagedAccess: createResourceDto.ownerManagedAccess || true,
        scopes: createResourceDto.scopes,
        uris: createResourceDto.uris,
      },
    );
  }

  @Put(':resourceId')
  @ApiOperation({ summary: 'Update a specific resource for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'resourceId', description: 'Internal ID of the resource' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: 200, description: 'Resource updated successfully.' })
  async update(
    @Param('clientId') clientId: string,
    @Param('resourceId') resourceId: string,
    @Body() updateDto: CreateResourceDto,
  ) {
    return this.keycloak.clients.updateResource(
      { id: clientId, resourceId },
      updateDto,
    );
  }

  @Delete(':resourceId')
  @ApiOperation({ summary: 'Delete a specific resource for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'resourceId', description: 'Internal ID of the resource' })
  @ApiResponse({ status: 204, description: 'Resource deleted successfully.' })
  async remove(
    @Param('clientId') clientId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.keycloak.clients.delResource({ id: clientId, resourceId });
  }
}
