import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly keycloak: KeycloakService) { }

  @Get()
  @ApiOperation({ summary: 'Get all roles from Keycloak' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  async findAll() {
    return this.keycloak.roles.find();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a specific role by its name' })
  @ApiParam({ name: 'name', description: 'The name of the role to fetch', example: 'admin' })
  @ApiResponse({ status: 200, description: 'Role found.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('name') name: string) {
    return this.keycloak.roles.findOneByName({ name });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role in Keycloak' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() roleRepresentation: CreateRoleDto) {
    return this.keycloak.roles.create(roleRepresentation);
  }
}