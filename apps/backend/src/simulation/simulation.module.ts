import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Simulation } from './entities/simulation.entity';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Simulation])],
  controllers: [SimulationController],
  providers: [SimulationService],
})
export class SimulationModule {}
