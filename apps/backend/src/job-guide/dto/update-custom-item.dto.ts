import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateCustomItemDto {
  @ApiPropertyOptional({ description: '항목 제목' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  itemTitle?: string;

  @ApiPropertyOptional({ description: '항목 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '항목 순서' })
  @IsOptional()
  @IsNumber()
  itemOrder?: number;

  @ApiPropertyOptional({ description: '목표일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '날짜 형식은 YYYY-MM-DD여야 합니다.' })
  targetDate?: string;
}
