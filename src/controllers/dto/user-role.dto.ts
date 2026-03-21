import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto {
  @ApiProperty({ description: 'The unique ID of the role' })
  id: string;

  @ApiProperty({ description: 'The name of the role' })
  name: string;
}
