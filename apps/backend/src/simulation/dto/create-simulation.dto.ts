import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator';

export class CreateSimulationDto {
  @IsInt()
  @Min(0)
  @Max(5)
  completedStep: number;

  @IsOptional()
  @IsObject()
  step1Input?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  step3Input?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  results?: Record<string, unknown>;
}
