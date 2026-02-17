import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobGuideService } from './job-guide.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JobGuideResponseDto } from './dto/job-guide-response.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { SetTargetDateDto } from './dto/set-target-date.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
import { UpdateCustomItemDto } from './dto/update-custom-item.dto';

@ApiTags('job-guide')
@ApiBearerAuth()
@Controller('job-guide')
export class JobGuideController {
  constructor(private readonly jobGuideService: JobGuideService) {}

  @Get()
  @ApiOperation({ summary: '전체 이직 가이드 조회 (6단계 + 진행 상황)' })
  @ApiResponse({
    status: 200,
    description: '사용자별 이직 가이드 전체 데이터 (단계, 항목, 진행률, 메모, 커스텀 항목)',
    type: JobGuideResponseDto,
  })
  async getFullJobGuide(@CurrentUser('id') userId: string): Promise<JobGuideResponseDto> {
    return this.jobGuideService.getFullJobGuide(userId);
  }

  // ── 진행 상황 ──

  @Patch('progress/:itemCode')
  @ApiOperation({ summary: '진행 상황 업데이트 (체크박스 토글)' })
  @ApiResponse({ status: 200, description: '진행 상황이 업데이트되었습니다.' })
  async updateProgress(
    @CurrentUser('id') userId: string,
    @Param('itemCode') itemCode: string,
    @Body() dto: UpdateProgressDto,
  ): Promise<void> {
    await this.jobGuideService.updateProgress(userId, itemCode, dto);
  }

  @Patch('progress/:itemCode/disable')
  @ApiOperation({ summary: '항목 비활성화 토글' })
  @ApiResponse({ status: 200, description: '항목 비활성화 상태가 변경되었습니다.' })
  async toggleDisabled(
    @CurrentUser('id') userId: string,
    @Param('itemCode') itemCode: string,
  ): Promise<void> {
    await this.jobGuideService.toggleDisabled(userId, itemCode);
  }

  @Put('progress/:itemCode/target-date')
  @ApiOperation({ summary: '목표일 설정' })
  @ApiResponse({ status: 200, description: '목표일이 설정되었습니다.' })
  async setTargetDate(
    @CurrentUser('id') userId: string,
    @Param('itemCode') itemCode: string,
    @Body() dto: SetTargetDateDto,
  ): Promise<void> {
    await this.jobGuideService.setTargetDate(userId, itemCode, dto);
  }

  // ── 메모 ──

  @Post('notes')
  @ApiOperation({ summary: '메모 생성' })
  @ApiResponse({ status: 201, description: '메모가 생성되었습니다.' })
  async createNote(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateNoteDto,
  ): Promise<void> {
    await this.jobGuideService.createNote(userId, dto);
  }

  @Patch('notes/:noteId')
  @ApiOperation({ summary: '메모 수정' })
  @ApiResponse({ status: 200, description: '메모가 수정되었습니다.' })
  async updateNote(
    @CurrentUser('id') userId: string,
    @Param('noteId') noteId: number,
    @Body() dto: UpdateNoteDto,
  ): Promise<void> {
    await this.jobGuideService.updateNote(userId, noteId, dto);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: '메모 삭제' })
  @ApiResponse({ status: 200, description: '메모가 삭제되었습니다.' })
  async deleteNote(
    @CurrentUser('id') userId: string,
    @Param('noteId') noteId: number,
  ): Promise<void> {
    await this.jobGuideService.deleteNote(userId, noteId);
  }

  // ── 커스텀 항목 ──

  @Post('custom-items')
  @ApiOperation({ summary: '커스텀 항목 추가' })
  @ApiResponse({ status: 201, description: '커스텀 항목이 추가되었습니다.' })
  async createCustomItem(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCustomItemDto,
  ): Promise<void> {
    await this.jobGuideService.createCustomItem(userId, dto);
  }

  @Patch('custom-items/:customItemId')
  @ApiOperation({ summary: '커스텀 항목 수정' })
  @ApiResponse({ status: 200, description: '커스텀 항목이 수정되었습니다.' })
  async updateCustomItem(
    @CurrentUser('id') userId: string,
    @Param('customItemId') customItemId: number,
    @Body() dto: UpdateCustomItemDto,
  ): Promise<void> {
    await this.jobGuideService.updateCustomItem(userId, customItemId, dto);
  }

  @Delete('custom-items/:customItemId')
  @ApiOperation({ summary: '커스텀 항목 삭제' })
  @ApiResponse({ status: 200, description: '커스텀 항목이 삭제되었습니다.' })
  async deleteCustomItem(
    @CurrentUser('id') userId: string,
    @Param('customItemId') customItemId: number,
  ): Promise<void> {
    await this.jobGuideService.deleteCustomItem(userId, customItemId);
  }

  @Patch('custom-items/:customItemId/complete')
  @ApiOperation({ summary: '커스텀 항목 완료 토글' })
  @ApiResponse({ status: 200, description: '커스텀 항목 완료 상태가 변경되었습니다.' })
  async toggleCustomItemCompletion(
    @CurrentUser('id') userId: string,
    @Param('customItemId') customItemId: number,
  ): Promise<void> {
    await this.jobGuideService.toggleCustomItemCompletion(userId, customItemId);
  }

  // ── 템플릿 다운로드 ──

  @Get('downloads')
  @ApiOperation({ summary: '다운로드 가능한 템플릿 목록 조회' })
  @ApiResponse({ status: 200, description: '템플릿 목록이 반환됩니다.' })
  async getTemplateDownloads() {
    return this.jobGuideService.getTemplateDownloads();
  }

  @Post('downloads/:templateKey')
  @ApiOperation({ summary: '템플릿 다운로드 카운트 증가' })
  @ApiResponse({ status: 200, description: '다운로드 카운트가 증가되었습니다.' })
  async recordDownload(
    @Param('templateKey') templateKey: string,
  ): Promise<void> {
    await this.jobGuideService.recordDownload(templateKey);
  }
}
