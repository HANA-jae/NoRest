import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuInfo } from './entities/menu-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuInfo])],
  exports: [TypeOrmModule],
})
export class MenuModule {}
