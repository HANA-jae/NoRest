/**
 * 이직 가이드 관련 타입 정의
 * Backend DTO와 동기화
 */

export interface JobGuideItem {
  itemId: number;
  itemCode: string;
  itemTitle: string;
  itemOrder: number;
  description?: string;
  tips?: string;
  exampleContent?: string;
  referenceLinks?: Array<{ title: string; url: string }>;
  estimatedHours?: number;
  isRequired: boolean;
  // 사용자별 진행 상황
  isCompleted: boolean;
  isDisabled: boolean;
  targetDate?: string; // ISO 날짜 문자열 (YYYY-MM-DD)
  completedDate?: string; // ISO 날짜 문자열
  noteId?: number;
  note?: string;
}

export interface JobGuidePhase {
  templateId: number;
  phaseId: string;
  phaseNum: string;
  phaseTitle: string;
  phaseOrder: number;
  description?: string;
  estimatedDays?: number;
  items: JobGuideItem[];
  phaseNoteId?: number;
  phaseNote?: string;
}

export interface OverallProgress {
  totalItems: number;
  completedItems: number;
  progressPercentage: number;
}

export interface JobGuideData {
  phases: JobGuidePhase[];
  overallProgress: OverallProgress;
}

/**
 * API 요청/응답 타입
 */

// 진행 상황 업데이트
export interface UpdateProgressPayload {
  isCompleted: boolean;
}

// 목표일 설정
export interface SetTargetDatePayload {
  targetDate: string | null; // YYYY-MM-DD 또는 null
}

// 메모 생성/수정
export interface CreateNotePayload {
  noteType: 'ITEM' | 'PHASE';
  itemCode?: string; // noteType='ITEM'인 경우 필수
  templateId?: number; // noteType='PHASE'인 경우 필수
  content: string;
}

export interface UpdateNotePayload {
  content: string;
}

// 커스텀 항목 생성/수정
export interface CreateCustomItemPayload {
  templateId: number;
  itemTitle: string;
  description?: string;
  itemOrder: number;
  targetDate?: string; // YYYY-MM-DD
}

export interface UpdateCustomItemPayload {
  itemTitle?: string;
  description?: string;
  itemOrder?: number;
  targetDate?: string;
}

/**
 * UI 상태 타입
 */
export interface JobGuideUIState {
  activePhaseId: string;
  selectedItemCode: string | null;
  showDetailModal: boolean;
  showNoteEditor: boolean;
  showCustomItemForm: boolean;
}

/**
 * 캘린더 뷰용 타입
 */
export interface CalendarItem {
  itemCode: string;
  itemTitle: string;
  targetDate: string;
  isCompleted: boolean;
  phaseTitle: string;
  dDay: number; // 남은 일수 (양수: 미래, 음수: 과거, 0: 오늘)
}

/**
 * 템플릿 다운로드 타입
 */
export interface TemplateDownload {
  downloadId: number;
  templateKey: string;
  templateName: string;
  templateType: string;
  category: string;
  description: string | null;
  filePath: string;
  fileSize: number | null;
  downloadCount: number;
}
