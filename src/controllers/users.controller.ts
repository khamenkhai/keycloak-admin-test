import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { KeycloakService } from '../keycloak/keycloak.service';

export class CreateUserDto {
  @ApiProperty()
  username: string;
  @ApiProperty({ required: false })
  email?: string;
  @ApiProperty({ required: false })
  firstName?: string;
  @ApiProperty({ required: false })
  lastName?: string;
  @ApiProperty({ required: false, default: true })
  enabled?: boolean;
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly keycloak: KeycloakService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Query('first') first?: number, @Query('max') max?: number) {
    return this.keycloak.users.find({ first, max });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.keycloak.users.findOne({ id });
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.keycloak.users.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.keycloak.users.update({ id }, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id') id: string) {
    return this.keycloak.users.del({ id });
  }
}
