import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('simulations')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  async save(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSimulationDto,
  ) {
    return this.simulationService.save(userId, dto);
  }

  @Get('me')
  async getMyList(@CurrentUser('id') userId: string) {
    return this.simulationService.getMyList(userId);
  }

  @Delete(':id')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deleted = await this.simulationService.remove(id, userId);
    return { deleted };
  }
}
