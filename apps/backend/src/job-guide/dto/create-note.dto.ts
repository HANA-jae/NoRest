import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ description: '메모 타입', enum: ['ITEM', 'PHASE'] })
  @IsEnum(['ITEM', 'PHASE'])
  noteType: 'ITEM' | 'PHASE';

  @ApiPropertyOptional({ description: '항목 코드 (noteType=ITEM인 경우 필수)' })
  @ValidateIf((o) => o.noteType === 'ITEM')
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({ description: '템플릿 ID (noteType=PHASE인 경우 필수)' })
  @ValidateIf((o) => o.noteType === 'PHASE')
  @IsNumber()
  templateId?: number;

  @ApiProperty({ description: '메모 내용' })
  @IsString()
  content: string;
}
