import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class SetTargetDateDto {
  @ApiPropertyOptional({ description: '목표일 (YYYY-MM-DD)', example: '2026-03-01' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '날짜 형식은 YYYY-MM-DD여야 합니다.' })
  targetDate: string | null;
}
