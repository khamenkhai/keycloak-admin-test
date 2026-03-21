import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsBooleanString } from 'class-validator';

export class CreateScopeDto {
  @ApiProperty({ description: 'Name of the scope' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Display name of the scope' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Icon URI for the scope' })
  @IsOptional()
  @IsString()
  iconUri?: string;
}

export class CreatePolicyDto {
  @ApiProperty({ description: 'Name of the policy' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the policy' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of the policy (e.g., role, user, time, client)',
    example: 'role',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Logic of the policy (POSITIVE or NEGATIVE)',
    enum: ['POSITIVE', 'NEGATIVE'],
    default: 'POSITIVE',
  })
  @IsEnum(['POSITIVE', 'NEGATIVE'])
  logic: 'POSITIVE' | 'NEGATIVE';

  @ApiPropertyOptional({
    description: 'Roles associated with this policy',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}


export class AssignPermissionToRoleDto {
  @ApiProperty({ description: 'The ID of the client role' })
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiProperty({ description: 'Name of the newly generated policy' })
  @IsNotEmpty()
  @IsString()
  policyName: string;

  @ApiProperty({ description: 'Name of the permission to wrap it into' })
  @IsNotEmpty()
  @IsString()
  permissionName: string;

  @ApiProperty({
    description: 'Permission type to create (resource or scope)',
    enum: ['resource', 'scope'],
  })
  @IsEnum(['resource', 'scope'])
  permissionType: 'resource' | 'scope';

  @ApiPropertyOptional({
    description: 'Resources to protect (required if type is resource)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[];

  @ApiPropertyOptional({
    description: 'Scopes to protect',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];
}