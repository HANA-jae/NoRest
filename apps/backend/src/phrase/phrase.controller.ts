import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhraseService } from './phrase.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('phrases')
@ApiBearerAuth()
@Controller('phrases')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Get('daily')
  @ApiOperation({ summary: '오늘의 문구 조회' })
  @ApiResponse({ status: 200, description: '오늘의 문구 1개 반환' })
  async getDailyPhrase(@CurrentUser('id') userId: string) {
    return this.phraseService.getDailyPhrase(userId);
  }
}
