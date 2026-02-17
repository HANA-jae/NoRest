import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({ description: '완료 여부' })
  @IsBoolean()
  isCompleted: boolean;
}
