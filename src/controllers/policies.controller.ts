import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreatePolicyDto } from './dto/authorization.dto';
import { Logic } from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';

@ApiTags('Client Policies (Authorization)')
@Controller('clients/:clientId/policies')
export class PoliciesController {
  constructor(private readonly keycloak: KeycloakService) { }

  @Get()
  @ApiOperation({ summary: 'List all authorization policies for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiResponse({ status: 200, description: 'List of policies.' })
  async findAll(@Param('clientId') clientId: string) {
    return this.keycloak.clients.listPolicies({ id: clientId });
  }

  @Get(':policyId')
  @ApiOperation({ summary: 'Get a specific authorization policy for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'policyId', description: 'Internal ID of the policy' })
  @ApiResponse({ status: 200, description: 'Policy found.' })
  async findOne(
    @Param('clientId') clientId: string,
    @Param('policyId') policyId: string,
  ) {
    const policies = await this.keycloak.clients.listPolicies({ id: clientId, policyId: policyId } as any);
    return policies.length > 0 ? policies[0] : null;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new authorization policy for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiBody({ type: CreatePolicyDto })
  @ApiResponse({ status: 201, description: 'Policy created successfully.' })
  async create(
    @Param('clientId') clientId: string,
    @Body() createPolicyDto: CreatePolicyDto,
  ) {
    const { type, name, description, logic, roles } = createPolicyDto;

    return this.keycloak.clients.createPolicy(
      { id: clientId, type: type },
      {

        name,
        description,
        logic: logic === "NEGATIVE" ? Logic.NEGATIVE : Logic.POSITIVE,
        roles: roles?.map((roleId) => ({
          id: roleId,
          required: true,
        })),
      },
    );
  }


  @Put(':policyId')
  @ApiOperation({ summary: 'Update an authorization policy for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'policyId', description: 'Internal ID of the policy' })
  @ApiBody({ type: CreatePolicyDto })
  @ApiResponse({ status: 200, description: 'Policy updated successfully.' })
  async update(
    @Param('clientId') clientId: string,
    @Param('policyId') policyId: string,
    @Body() updateDto: CreatePolicyDto,
  ) {
    return this.keycloak.clients.updatePolicy(
      { id: clientId, type: updateDto.type, policyId: policyId },
      {
        name: updateDto.name,
        description: updateDto.description,
        logic: updateDto.logic === "NEGATIVE" ? Logic.NEGATIVE : Logic.POSITIVE,
        roles: updateDto.roles?.map((roleId) => ({
          id: roleId,
          required: true,
        })),
      },
    );
  }

  @Delete(':policyId')
  @ApiOperation({ summary: 'Delete an authorization policy for a client' })
  @ApiParam({ name: 'clientId', description: 'Internal ID of the client' })
  @ApiParam({ name: 'policyId', description: 'Internal ID of the policy' })
  @ApiQuery({ name: 'type', required: true, description: 'Type of the policy to delete' })
  @ApiResponse({ status: 204, description: 'Policy deleted successfully.' })
  async remove(
    @Param('clientId') clientId: string,
    @Param('policyId') policyId: string,
    @Query('type') type: string,
  ) {
    return this.keycloak.clients.delPolicy({ id: clientId, policyId: policyId });
  }
}
