import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';

@ApiTags('Realms')
@Controller('realms')
export class RealmsController {
  constructor(private readonly keycloak: KeycloakService) { }

  @Get()
  @ApiOperation({ summary: 'Get all realms' })
  async findAll() {
    return this.keycloak.realms.find();
  }


  @Get(':realm')
  @ApiOperation({ summary: 'Get realm by name' })
  async findOne(@Param('realm') realm: string) {
    return this.keycloak.realms.findOne({ realm });
  }

  @Post()
  @ApiOperation({ summary: 'Create realm' })
  async create(@Body() realmRepresentation: any) {
    return this.keycloak.realms.create(realmRepresentation);
  }
}
