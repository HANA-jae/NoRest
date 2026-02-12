import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeMaster } from './entities/code-master.entity';
import { CodeDetail } from './entities/code-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeMaster, CodeDetail])],
  exports: [TypeOrmModule],
})
export class CodeModule {}
