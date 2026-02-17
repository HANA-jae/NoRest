import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user01' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: '아이디는 2자 이상이어야 합니다' })
  @MaxLength(50, { message: '아이디는 50자 이하여야 합니다' })
  userId: string;

  @ApiProperty({ example: '****' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: '비밀번호는 3자 이상이어야 합니다' })
  password: string;
}
