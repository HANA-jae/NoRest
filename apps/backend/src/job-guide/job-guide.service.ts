import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobGuideTemplate } from './entities/job-guide-template.entity';
import { JobGuideItem } from './entities/job-guide-item.entity';
import { JobGuideProgress } from './entities/job-guide-progress.entity';
import { JobGuideNote, NoteType } from './entities/job-guide-note.entity';
import { JobGuideCustomItem } from './entities/job-guide-custom-item.entity';
import { JobGuideTemplateDownload } from './entities/job-guide-template-download.entity';
import {
  JobGuideResponseDto,
  JobGuidePhaseResponseDto,
  JobGuideItemResponseDto,
  OverallProgressDto,
} from './dto/job-guide-response.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { SetTargetDateDto } from './dto/set-target-date.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
import { UpdateCustomItemDto } from './dto/update-custom-item.dto';

@Injectable()
export class JobGuideService {
  constructor(
    @InjectRepository(JobGuideTemplate)
    private readonly templateRepository: Repository<JobGuideTemplate>,
    @InjectRepository(JobGuideItem)
    private readonly itemRepository: Repository<JobGuideItem>,
    @InjectRepository(JobGuideProgress)
    private readonly progressRepository: Repository<JobGuideProgress>,
    @InjectRepository(JobGuideNote)
    private readonly noteRepository: Repository<JobGuideNote>,
    @InjectRepository(JobGuideCustomItem)
    private readonly customItemRepository: Repository<JobGuideCustomItem>,
    @InjectRepository(JobGuideTemplateDownload)
    private readonly templateDownloadRepository: Repository<JobGuideTemplateDownload>,
  ) {}

  /**
   * 사용자별 전체 이직 가이드 조회
   * - 6개 단계 + 항목 + 진행 상황 + 메모 + 커스텀 항목 통합
   */
  async getFullJobGuide(userId: string): Promise<JobGuideResponseDto> {
    // 1. 모든 템플릿 + 항목 조회 (relations 사용)
    const templates = await this.templateRepository.find({
      relations: ['items'],
      order: {
        phaseOrder: 'ASC',
        items: {
          itemOrder: 'ASC',
        },
      },
    });

    // 2. 사용자 진행 상황 조회
    const progressList = await this.progressRepository.find({
      where: { userId },
    });

    // itemCode를 키로 하는 진행 상황 맵 생성
    const progressMap = new Map<string, JobGuideProgress>();
    progressList.forEach((progress) => {
      progressMap.set(progress.itemCode, progress);
    });

    // 3. 사용자 메모 조회 (ITEM 타입)
    const itemNotes = await this.noteRepository.find({
      where: { userId, noteType: NoteType.ITEM },
    });

    // itemCode를 키로 하는 메모 맵 생성 (noteId와 content 포함)
    const itemNoteMap = new Map<string, { noteId: number; content: string }>();
    itemNotes.forEach((note) => {
      if (note.itemCode) {
        itemNoteMap.set(note.itemCode, {
          noteId: note.noteId,
          content: note.content,
        });
      }
    });

    // 4. 단계별 메모 조회 (PHASE 타입)
    const phaseNotes = await this.noteRepository.find({
      where: { userId, noteType: NoteType.PHASE },
    });

    // templateId를 키로 하는 단계 메모 맵 생성 (noteId와 content 포함)
    const phaseNoteMap = new Map<number, { noteId: number; content: string }>();
    phaseNotes.forEach((note) => {
      if (note.templateId) {
        phaseNoteMap.set(note.templateId, {
          noteId: note.noteId,
          content: note.content,
        });
      }
    });

    // 5. 사용자 커스텀 항목 조회
    const customItems = await this.customItemRepository.find({
      where: { userId },
      order: { itemOrder: 'ASC' },
    });

    // templateId를 키로 하는 커스텀 항목 그룹 생성
    const customItemsByTemplate = new Map<number, JobGuideCustomItem[]>();
    customItems.forEach((item) => {
      const existing = customItemsByTemplate.get(item.templateId) || [];
      existing.push(item);
      customItemsByTemplate.set(item.templateId, existing);
    });

    // 6. 데이터 병합: Phase DTO 생성
    const phases: JobGuidePhaseResponseDto[] = templates.map((template) => {
      // 기본 항목들을 DTO로 변환
      const standardItems: JobGuideItemResponseDto[] = template.items
        .filter((item) => item.isActive)
        .map((item) => {
          const progress = progressMap.get(item.itemCode);
          const note = itemNoteMap.get(item.itemCode);

          return {
            itemId: item.itemId,
            itemCode: item.itemCode,
            itemTitle: item.itemTitle,
            itemOrder: item.itemOrder,
            description: item.description || undefined,
            tips: item.tips || undefined,
            exampleContent: item.exampleContent || undefined,
            referenceLinks: item.referenceLinks || undefined,
            estimatedHours: item.estimatedHours || undefined,
            isRequired: item.isRequired,
            // 사용자별 진행 상황
            isCompleted: progress?.isCompleted || false,
            isDisabled: progress?.isDisabled || false,
            targetDate: progress?.targetDate
              ? progress.targetDate.toISOString().split('T')[0]
              : undefined,
            completedDate: progress?.completedDate
              ? progress.completedDate.toISOString()
              : undefined,
            noteId: note?.noteId,
            note: note?.content,
          };
        });

      // 커스텀 항목들을 DTO로 변환
      const customItemsForPhase = customItemsByTemplate.get(template.templateId) || [];
      const customItemDtos: JobGuideItemResponseDto[] = customItemsForPhase.map((custom) => ({
        itemId: custom.customItemId,
        itemCode: `custom_${custom.customItemId}`,
        itemTitle: custom.itemTitle,
        itemOrder: custom.itemOrder,
        description: custom.description || undefined,
        tips: undefined,
        exampleContent: undefined,
        referenceLinks: undefined,
        estimatedHours: undefined,
        isRequired: false, // 커스텀 항목은 필수 아님
        isCompleted: custom.isCompleted,
        isDisabled: false, // 커스텀 항목은 비활성화 대상 아님
        targetDate: custom.targetDate
          ? custom.targetDate.toISOString().split('T')[0]
          : undefined,
        completedDate: custom.completedDate ? custom.completedDate.toISOString() : undefined,
        note: undefined,
      }));

      // 표준 항목 + 커스텀 항목 통합 후 itemOrder로 정렬
      const allItems = [...standardItems, ...customItemDtos].sort(
        (a, b) => a.itemOrder - b.itemOrder,
      );

      return {
        templateId: template.templateId,
        phaseId: template.phaseId,
        phaseNum: template.phaseNum,
        phaseTitle: template.phaseTitle,
        phaseOrder: template.phaseOrder,
        description: template.description || undefined,
        estimatedDays: template.estimatedDays || undefined,
        items: allItems,
        phaseNoteId: phaseNoteMap.get(template.templateId)?.noteId,
        phaseNote: phaseNoteMap.get(template.templateId)?.content,
      };
    });

    // 7. 전체 진행률 계산
    let totalItems = 0;
    let completedItems = 0;

    phases.forEach((phase) => {
      phase.items.forEach((item) => {
        if (item.isDisabled) return; // 비활성화 항목은 진행률에서 제외
        totalItems++;
        if (item.isCompleted) {
          completedItems++;
        }
      });
    });

    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const overallProgress: OverallProgressDto = {
      totalItems,
      completedItems,
      progressPercentage,
    };

    return {
      phases,
      overallProgress,
    };
  }

  /**
   * 진행 상황 업데이트 (체크박스 토글)
   */
  async updateProgress(userId: string, itemCode: string, dto: UpdateProgressDto): Promise<void> {
    let progress = await this.progressRepository.findOne({
      where: { userId, itemCode },
    });

    if (progress) {
      progress.isCompleted = dto.isCompleted;
      progress.completedDate = dto.isCompleted ? new Date() : null;
      progress.modifiedDate = new Date();
    } else {
      progress = this.progressRepository.create({
        userId,
        itemCode,
        isCompleted: dto.isCompleted,
        completedDate: dto.isCompleted ? new Date() : null,
      });
    }

    await this.progressRepository.save(progress);
  }

  /**
   * 항목 비활성화 토글
   */
  async toggleDisabled(userId: string, itemCode: string): Promise<void> {
    let progress = await this.progressRepository.findOne({
      where: { userId, itemCode },
    });

    if (progress) {
      progress.isDisabled = !progress.isDisabled;
      progress.modifiedDate = new Date();
    } else {
      progress = this.progressRepository.create({
        userId,
        itemCode,
        isCompleted: false,
        isDisabled: true,
      });
    }

    await this.progressRepository.save(progress);
  }

  /**
   * 목표일 설정
   */
  async setTargetDate(userId: string, itemCode: string, dto: SetTargetDateDto): Promise<void> {
    let progress = await this.progressRepository.findOne({
      where: { userId, itemCode },
    });

    if (progress) {
      progress.targetDate = dto.targetDate ? new Date(dto.targetDate) : null;
      progress.modifiedDate = new Date();
    } else {
      progress = this.progressRepository.create({
        userId,
        itemCode,
        isCompleted: false,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      });
    }

    await this.progressRepository.save(progress);
  }

  /**
   * 메모 생성
   */
  async createNote(userId: string, dto: CreateNoteDto): Promise<JobGuideNote> {
    const note = this.noteRepository.create({
      userId,
      noteType: dto.noteType as NoteType,
      itemCode: dto.itemCode || null,
      templateId: dto.templateId || null,
      content: dto.content,
    });

    return this.noteRepository.save(note);
  }

  /**
   * 메모 수정
   */
  async updateNote(userId: string, noteId: number, dto: UpdateNoteDto): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { noteId, userId },
    });

    if (!note) {
      throw new NotFoundException('메모를 찾을 수 없습니다.');
    }

    note.content = dto.content;
    note.modifiedDate = new Date();
    await this.noteRepository.save(note);
  }

  /**
   * 메모 삭제
   */
  async deleteNote(userId: string, noteId: number): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { noteId, userId },
    });

    if (!note) {
      throw new NotFoundException('메모를 찾을 수 없습니다.');
    }

    await this.noteRepository.remove(note);
  }

  /**
   * 커스텀 항목 추가
   */
  async createCustomItem(userId: string, dto: CreateCustomItemDto): Promise<JobGuideCustomItem> {
    const customItem = this.customItemRepository.create({
      userId,
      templateId: dto.templateId,
      itemTitle: dto.itemTitle,
      description: dto.description || null,
      itemOrder: dto.itemOrder,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      isCompleted: false,
    });

    return this.customItemRepository.save(customItem);
  }

  /**
   * 커스텀 항목 수정
   */
  async updateCustomItem(
    userId: string,
    customItemId: number,
    dto: UpdateCustomItemDto,
  ): Promise<void> {
    const customItem = await this.customItemRepository.findOne({
      where: { customItemId, userId },
    });

    if (!customItem) {
      throw new NotFoundException('커스텀 항목을 찾을 수 없습니다.');
    }

    if (dto.itemTitle !== undefined) customItem.itemTitle = dto.itemTitle;
    if (dto.description !== undefined) customItem.description = dto.description || null;
    if (dto.itemOrder !== undefined) customItem.itemOrder = dto.itemOrder;
    if (dto.targetDate !== undefined) {
      customItem.targetDate = dto.targetDate ? new Date(dto.targetDate) : null;
    }
    customItem.modifiedDate = new Date();

    await this.customItemRepository.save(customItem);
  }

  /**
   * 커스텀 항목 삭제
   */
  async deleteCustomItem(userId: string, customItemId: number): Promise<void> {
    const customItem = await this.customItemRepository.findOne({
      where: { customItemId, userId },
    });

    if (!customItem) {
      throw new NotFoundException('커스텀 항목을 찾을 수 없습니다.');
    }

    await this.customItemRepository.remove(customItem);
  }

  /**
   * 커스텀 항목 완료 토글
   */
  async toggleCustomItemCompletion(userId: string, customItemId: number): Promise<void> {
    const customItem = await this.customItemRepository.findOne({
      where: { customItemId, userId },
    });

    if (!customItem) {
      throw new NotFoundException('커스텀 항목을 찾을 수 없습니다.');
    }

    customItem.isCompleted = !customItem.isCompleted;
    customItem.completedDate = customItem.isCompleted ? new Date() : null;
    customItem.modifiedDate = new Date();

    await this.customItemRepository.save(customItem);
  }

  /**
   * 다운로드 가능한 템플릿 목록 조회
   */
  async getTemplateDownloads(): Promise<JobGuideTemplateDownload[]> {
    return this.templateDownloadRepository.find({
      where: { isActive: true },
      order: { category: 'ASC', templateName: 'ASC' },
    });
  }

  /**
   * 템플릿 다운로드 카운트 증가
   */
  async recordDownload(templateKey: string): Promise<void> {
    const template = await this.templateDownloadRepository.findOne({
      where: { templateKey, isActive: true },
    });

    if (!template) {
      throw new NotFoundException('템플릿을 찾을 수 없습니다.');
    }

    template.downloadCount = Number(template.downloadCount) + 1;
    template.modifiedDate = new Date();
    await this.templateDownloadRepository.save(template);
  }
}
