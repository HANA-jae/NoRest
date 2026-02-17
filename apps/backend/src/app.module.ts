import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { CodeModule } from './code/code.module';
import { MenuModule } from './menu/menu.module';
import { FileModule } from './file/file.module';
import { AuditModule } from './audit/audit.module';
import { PhraseModule } from './phrase/phrase.module';
import { JobGuideModule } from './job-guide/job-guide.module';
import { SimulationModule } from './simulation/simulation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    HealthModule,
    CodeModule,
    MenuModule,
    FileModule,
    AuditModule,
    PhraseModule,
    JobGuideModule,
    SimulationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
