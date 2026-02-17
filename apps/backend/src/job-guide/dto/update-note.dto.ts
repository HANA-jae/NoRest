import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ description: '메모 내용' })
  @IsString()
  content: string;
}
