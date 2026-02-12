import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'testuser' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: '010-1234-5678' })
  phone: string;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiPropertyOptional({ example: 'profile.jpg' })
  profile?: string | null;

  @ApiPropertyOptional({ example: '2026-02-12' })
  lastLogin?: string | null;

  @ApiPropertyOptional()
  createdDate?: Date | null;

  @ApiPropertyOptional()
  modifiedDate?: Date | null;
}
