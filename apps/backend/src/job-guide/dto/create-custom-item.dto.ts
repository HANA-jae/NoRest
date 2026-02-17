import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCustomItemDto {
  @ApiProperty({ description: '템플릿 ID (어떤 단계에 속하는지)' })
  @IsNumber()
  templateId: number;

  @ApiProperty({ description: '항목 제목', example: '나만의 체크리스트' })
  @IsString()
  @MaxLength(200)
  itemTitle: string;

  @ApiPropertyOptional({ description: '항목 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '항목 순서' })
  @IsNumber()
  itemOrder: number;

  @ApiPropertyOptional({ description: '목표일 (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '날짜 형식은 YYYY-MM-DD여야 합니다.' })
  targetDate?: string;
}
