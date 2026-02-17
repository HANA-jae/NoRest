import { ApiProperty } from '@nestjs/swagger';

export class JobGuideItemResponseDto {
  @ApiProperty()
  itemId: number;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemTitle: string;

  @ApiProperty()
  itemOrder: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  tips?: string;

  @ApiProperty({ required: false })
  exampleContent?: string;

  @ApiProperty({ required: false })
  referenceLinks?: Array<{ title: string; url: string }>;

  @ApiProperty({ required: false })
  estimatedHours?: number;

  @ApiProperty()
  isRequired: boolean;

  // 사용자별 진행 상황
  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty()
  isDisabled: boolean;

  @ApiProperty({ required: false })
  targetDate?: string;

  @ApiProperty({ required: false })
  completedDate?: string;

  @ApiProperty({ required: false })
  noteId?: number;

  @ApiProperty({ required: false })
  note?: string;
}

export class JobGuidePhaseResponseDto {
  @ApiProperty()
  templateId: number;

  @ApiProperty()
  phaseId: string;

  @ApiProperty()
  phaseNum: string;

  @ApiProperty()
  phaseTitle: string;

  @ApiProperty()
  phaseOrder: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  estimatedDays?: number;

  @ApiProperty({ type: [JobGuideItemResponseDto] })
  items: JobGuideItemResponseDto[];

  @ApiProperty({ required: false })
  phaseNoteId?: number;

  @ApiProperty({ required: false })
  phaseNote?: string;
}

export class OverallProgressDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  completedItems: number;

  @ApiProperty()
  progressPercentage: number;
}

export class JobGuideResponseDto {
  @ApiProperty({ type: [JobGuidePhaseResponseDto] })
  phases: JobGuidePhaseResponseDto[];

  @ApiProperty()
  overallProgress: OverallProgressDto;
}
