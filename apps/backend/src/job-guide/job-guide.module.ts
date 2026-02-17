import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobGuideTemplate } from './entities/job-guide-template.entity';
import { JobGuideItem } from './entities/job-guide-item.entity';
import { JobGuideProgress } from './entities/job-guide-progress.entity';
import { JobGuideNote } from './entities/job-guide-note.entity';
import { JobGuideCustomItem } from './entities/job-guide-custom-item.entity';
import { JobGuideTemplateDownload } from './entities/job-guide-template-download.entity';
import { JobGuideService } from './job-guide.service';
import { JobGuideController } from './job-guide.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobGuideTemplate,
      JobGuideItem,
      JobGuideProgress,
      JobGuideNote,
      JobGuideCustomItem,
      JobGuideTemplateDownload,
    ]),
  ],
  controllers: [JobGuideController],
  providers: [JobGuideService],
  exports: [JobGuideService],
})
export class JobGuideModule {}
