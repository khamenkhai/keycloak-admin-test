import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly keycloak: KeycloakService) {}

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  async findAll() {
    return this.keycloak.groups.find();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  async findOne(@Param('id') id: string) {
    return this.keycloak.groups.findOne({ id });
  }

  @Post()
  @ApiOperation({ summary: 'Create group' })
  async create(@Body() groupRepresentation: any) {
    return this.keycloak.groups.create(groupRepresentation);
  }
}
