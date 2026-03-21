import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreateScopeDto } from './dto/authorization.dto';

@ApiTags('Client Scopes (Authorization)')
@Controller('clients/:clientId/scopes')
export class ScopesController {
  constructor(private readonly keycloak: KeycloakService) { }

  @Get()
  @ApiOperation({ summary: 'List all authorization scopes for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiResponse({ status: 200, description: 'List of scopes.' })
  async findAll(@Param('clientId') clientId: string) {
    return this.keycloak.clients.listAllScopes({ id: clientId });
  }

  @Get(':scopeId')
  @ApiOperation({ summary: 'Get a specific authorization scope for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'scopeId', description: 'Internal ID of the scope' })
  @ApiResponse({ status: 200, description: 'Scope found.' })
  async findOne(
    @Param('clientId') clientId: string,
    @Param('scopeId') scopeId: string,
  ) {
    const scopes = await this.keycloak.clients.listAllScopes({ id: clientId, scopeId: scopeId } as any);
    return scopes.length > 0 ? scopes[0] : null;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new authorization scope for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: CreateScopeDto })
  @ApiResponse({ status: 201, description: 'Scope created successfully.' })
  async create(
    @Param('clientId') clientId: string,
    @Body() createScopeDto: CreateScopeDto,
  ) {
    return this.keycloak.clients.createAuthorizationScope(
      { id: clientId },
      createScopeDto,
    );
  }

  @Put(':scopeId')
  @ApiOperation({ summary: 'Update an authorization scope for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'scopeId', description: 'Internal ID of the scope' })
  @ApiBody({ type: CreateScopeDto })
  async update(
    @Param('clientId') clientId: string,
    @Param('scopeId') scopeId: string,
    @Body() updateDto: CreateScopeDto,
  ) {
    return this.keycloak.clients.updateAuthorizationScope(
      { id: clientId, scopeId },
      updateDto,
    );
  }

  @Delete(':scopeId')
  @ApiOperation({ summary: 'Delete an authorization scope for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'scopeId', description: 'Internal ID of the scope' })
  @ApiResponse({ status: 204, description: 'Scope deleted successfully.' })
  async remove(
    @Param('clientId') clientId: string,
    @Param('scopeId') scopeId: string,
  ) {
    return this.keycloak.clients.delAuthorizationScope({ id: clientId, scopeId });
  }
}
