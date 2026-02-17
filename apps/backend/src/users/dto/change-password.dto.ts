import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: '현재 비밀번호를 입력해주세요' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: '새 비밀번호를 입력해주세요' })
  @MinLength(4, { message: '비밀번호는 4자 이상이어야 합니다' })
  newPassword: string;
}
