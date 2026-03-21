import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsBooleanString } from 'class-validator';

export class CreateResourceDto {
    @ApiProperty({ description: 'Name of the resource' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Display name of the resource' })
    @IsOptional()
    @IsString()
    displayName?: string;

    @ApiPropertyOptional({ description: 'Array of URIs for the resource', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    uris?: string[];

    @ApiProperty({ description: 'Type of the resource' })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiPropertyOptional({ description: 'Owner of the resource' })
    @IsOptional()
    @IsBoolean()
    ownerManagedAccess?: boolean;

    @ApiPropertyOptional({
        description: 'Scopes associated with the resource',
        type: [Object],
    })
    @IsOptional()
    @IsArray()
    scopes?: any[];
}