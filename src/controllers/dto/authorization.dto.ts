import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ description: 'Name of the resource' })
  name: string;

  @ApiPropertyOptional({ description: 'Display name of the resource' })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Array of URIs for the resource', type: [String] })
  uris?: string[];

  @ApiProperty({ description: 'Type of the resource' })
  type: string;

  @ApiPropertyOptional({ description: 'Owner of the resource' })
  ownerManagedAccess?: boolean;

  @ApiPropertyOptional({
    description: 'Scopes associated with the resource',
    type: [Object],
  })
  scopes?: any[];
}

export class CreateScopeDto {
  @ApiProperty({ description: 'Name of the scope' })
  name: string;

  @ApiPropertyOptional({ description: 'Display name of the scope' })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Icon URI for the scope' })
  iconUri?: string;
}

export class CreatePolicyDto {
  @ApiProperty({ description: 'Name of the policy' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the policy' })
  description?: string;

  @ApiProperty({
    description: 'Type of the policy (e.g., role, user, time, client)',
    example: 'role',
  })
  type: string;

  @ApiProperty({
    description: 'Logic of the policy (POSITIVE or NEGATIVE)',
    enum: ['POSITIVE', 'NEGATIVE'],
    default: 'POSITIVE',
  })
  logic: 'POSITIVE' | 'NEGATIVE';

  @ApiPropertyOptional({
    description: 'Additional configuration for the policy (e.g., roles assigned to a role policy)',
    type: Object,
  })
  config?: any;
}

export class CreatePermissionDto {
  @ApiProperty({ description: 'Name of the permission' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the permission' })
  description?: string;

  @ApiProperty({
    description: 'Type of the permission (resource or scope)',
    enum: ['resource', 'scope'],
  })
  type: 'resource' | 'scope';

  @ApiProperty({
    description: 'Logic of the permission (POSITIVE or NEGATIVE)',
    enum: ['POSITIVE', 'NEGATIVE'],
    default: 'POSITIVE',
  })
  logic: 'POSITIVE' | 'NEGATIVE';

  @ApiProperty({ description: 'Decision strategy (UNANIMOUS, AFFIRMATIVE, CONSENSUS)' })
  decisionStrategy: 'UNANIMOUS' | 'AFFIRMATIVE' | 'CONSENSUS';

  @ApiPropertyOptional({
    description: 'Resources associated with this permission (if type is resource)',
    type: [String],
  })
  resources?: string[];

  @ApiPropertyOptional({
    description: 'Scopes associated with this permission',
    type: [String],
  })
  scopes?: string[];

  @ApiProperty({
    description: 'Policies assigned to evaluate this permission',
    type: [String],
  })
  policies: string[];
}

export class AssignPermissionToRoleDto {
  @ApiProperty({ description: 'The ID of the client role' })
  roleId: string;

  @ApiProperty({ description: 'Name of the newly generated policy' })
  policyName: string;

  @ApiProperty({ description: 'Name of the permission to wrap it into' })
  permissionName: string;

  @ApiProperty({
    description: 'Permission type to create (resource or scope)',
    enum: ['resource', 'scope'],
  })
  permissionType: 'resource' | 'scope';

  @ApiPropertyOptional({
    description: 'Resources to protect (required if type is resource)',
    type: [String],
  })
  resources?: string[];

  @ApiPropertyOptional({
    description: 'Scopes to protect',
    type: [String],
  })
  scopes?: string[];
}
