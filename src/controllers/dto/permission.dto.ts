import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsBooleanString } from 'class-validator';


export class CreatePermissionDto {
    @ApiProperty({ description: 'Name of the permission' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Description of the permission' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Type of the permission (resource or scope)',
        enum: ['resource', 'scope'],
    })
    @IsNotEmpty()
    @IsEnum(['resource', 'scope'])
    type: 'resource' | 'scope';

    @ApiProperty({
        description: 'Logic of the permission (POSITIVE or NEGATIVE)',
        enum: ['POSITIVE', 'NEGATIVE'],
        default: 'POSITIVE',
    })
    @IsEnum(['POSITIVE', 'NEGATIVE'])
    logic: 'POSITIVE' | 'NEGATIVE';

    @ApiProperty({
        description: 'Decision strategy (UNANIMOUS, AFFIRMATIVE, CONSENSUS)',
        enum: ['UNANIMOUS', 'AFFIRMATIVE', 'CONSENSUS']
    })
    @IsEnum(['UNANIMOUS', 'AFFIRMATIVE', 'CONSENSUS'])
    decisionStrategy: 'UNANIMOUS' | 'AFFIRMATIVE' | 'CONSENSUS';

    @ApiProperty({
        description: 'Resources associated with this permission',
        type: [String],
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    resources: string[];

    @ApiProperty({
        description: 'Scopes associated with this permission',
        type: [String],
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    scopes: string[];

    @ApiProperty({
        description: 'Roles associated with this policy',
        type: [String],
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    roles: string[];

    @ApiProperty({
        description: 'Policies assigned to evaluate this permission',
        type: [String],
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    policies: string[];
}