import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Simulation } from './entities/simulation.entity';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@Injectable()
export class SimulationService {
  constructor(
    @InjectRepository(Simulation)
    private readonly simulationRepo: Repository<Simulation>,
  ) {}

  async save(userId: string, dto: CreateSimulationDto) {
    const now = new Date();
    const inputData: Record<string, unknown> = {};
    if (dto.step1Input) inputData.step1Input = dto.step1Input;
    if (dto.step3Input) inputData.step3Input = dto.step3Input;

    const entity = this.simulationRepo.create({
      userId,
      completedStep: dto.completedStep,
      inputData: Object.keys(inputData).length > 0 ? inputData : null,
      resultData: dto.results || null,
      createdDate: now,
      modifiedDate: now,
    });

    const saved = await this.simulationRepo.save(entity);
    return this.toRecord(saved);
  }

  async getMyList(userId: string) {
    const list = await this.simulationRepo.find({
      where: { userId },
      order: { createdDate: 'DESC' },
      take: 50,
    });
    return list.map((s) => this.toRecord(s));
  }

  async remove(simulationId: number, userId: string): Promise<boolean> {
    const result = await this.simulationRepo.delete({
      simulationId,
      userId,
    });
    return (result.affected ?? 0) > 0;
  }

  private toRecord(s: Simulation) {
    const input = (s.inputData || {}) as Record<string, unknown>;
    return {
      id: String(s.simulationId),
      userId: s.userId,
      completedStep: s.completedStep,
      step1Input: input.step1Input ?? undefined,
      step3Input: input.step3Input ?? undefined,
      results: s.resultData ?? undefined,
      createdAt: s.createdDate.toISOString(),
      updatedAt: s.modifiedDate.toISOString(),
    };
  }
}
