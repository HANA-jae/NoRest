import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '@han/shared';

export class CreateUserDto {
  @ApiProperty({ example: 'testuser' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  id: string;

  @ApiProperty({ example: 'Password1!', minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  @MinLength(NAME_MIN_LENGTH)
  @MaxLength(NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '010-1234-5678' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'user' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}
