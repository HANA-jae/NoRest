import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@han/shared';

export class RegisterDto {
  @ApiProperty({ example: 'testuser' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  userId: string;

  @ApiProperty({ example: 'Password1!' })
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
}
