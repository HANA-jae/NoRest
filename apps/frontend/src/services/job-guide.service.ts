import { apiClient } from '@/lib/api-client';
import type {
  JobGuideData,
  UpdateProgressPayload,
  SetTargetDatePayload,
  CreateNotePayload,
  UpdateNotePayload,
  CreateCustomItemPayload,
  UpdateCustomItemPayload,
  TemplateDownload,
} from '@/types';

interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export const jobGuideService = {
  /**
   * 전체 이직 가이드 조회 (6단계 + 진행 상황 + 메모 + 커스텀 항목)
   */
  async getFullJobGuide(): Promise<JobGuideData | null> {
    try {
      const res = await apiClient.get<ApiEnvelope<JobGuideData>>('/job-guide');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch job guide:', error);
      return null;
    }
  },

  /**
   * 진행 상황 업데이트 (체크박스 토글)
   */
  async updateProgress(
    itemCode: string,
    payload: UpdateProgressPayload,
  ): Promise<boolean> {
    try {
      await apiClient.patch(`/job-guide/progress/${itemCode}`, payload);
      return true;
    } catch (error) {
      console.error(`Failed to update progress for ${itemCode}:`, error);
      return false;
    }
  },

  /**
   * 항목 비활성화 토글
   */
  async toggleDisabled(itemCode: string): Promise<boolean> {
    try {
      await apiClient.patch(`/job-guide/progress/${itemCode}/disable`, {});
      return true;
    } catch (error) {
      console.error(`Failed to toggle disabled for ${itemCode}:`, error);
      return false;
    }
  },

  /**
   * 목표일 설정
   */
  async setTargetDate(
    itemCode: string,
    payload: SetTargetDatePayload,
  ): Promise<boolean> {
    try {
      await apiClient.put(`/job-guide/progress/${itemCode}/target-date`, payload);
      return true;
    } catch (error) {
      console.error(`Failed to set target date for ${itemCode}:`, error);
      return false;
    }
  },

  /**
   * 메모 생성
   */
  async createNote(payload: CreateNotePayload): Promise<boolean> {
    try {
      await apiClient.post('/job-guide/notes', payload);
      return true;
    } catch (error) {
      console.error('Failed to create note:', error);
      return false;
    }
  },

  /**
   * 메모 수정
   */
  async updateNote(noteId: number, payload: UpdateNotePayload): Promise<boolean> {
    try {
      await apiClient.patch(`/job-guide/notes/${noteId}`, payload);
      return true;
    } catch (error) {
      console.error(`Failed to update note ${noteId}:`, error);
      return false;
    }
  },

  /**
   * 메모 삭제
   */
  async deleteNote(noteId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/job-guide/notes/${noteId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete note ${noteId}:`, error);
      return false;
    }
  },

  /**
   * 커스텀 항목 추가
   */
  async createCustomItem(payload: CreateCustomItemPayload): Promise<boolean> {
    try {
      await apiClient.post('/job-guide/custom-items', payload);
      return true;
    } catch (error) {
      console.error('Failed to create custom item:', error);
      return false;
    }
  },

  /**
   * 커스텀 항목 수정
   */
  async updateCustomItem(
    customItemId: number,
    payload: UpdateCustomItemPayload,
  ): Promise<boolean> {
    try {
      await apiClient.patch(`/job-guide/custom-items/${customItemId}`, payload);
      return true;
    } catch (error) {
      console.error(`Failed to update custom item ${customItemId}:`, error);
      return false;
    }
  },

  /**
   * 커스텀 항목 삭제
   */
  async deleteCustomItem(customItemId: number): Promise<boolean> {
    try {
      await apiClient.delete(`/job-guide/custom-items/${customItemId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete custom item ${customItemId}:`, error);
      return false;
    }
  },

  /**
   * 커스텀 항목 완료 토글
   */
  async toggleCustomItemCompletion(customItemId: number): Promise<boolean> {
    try {
      await apiClient.patch(`/job-guide/custom-items/${customItemId}/complete`, {});
      return true;
    } catch (error) {
      console.error(
        `Failed to toggle custom item completion ${customItemId}:`,
        error,
      );
      return false;
    }
  },

  /**
   * 다운로드 가능한 템플릿 목록 조회
   */
  async getTemplateDownloads(): Promise<TemplateDownload[] | null> {
    try {
      const res = await apiClient.get<ApiEnvelope<TemplateDownload[]>>('/job-guide/downloads');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch template downloads:', error);
      return null;
    }
  },

  /**
   * 템플릿 다운로드 카운트 기록
   */
  async recordDownload(templateKey: string): Promise<boolean> {
    try {
      await apiClient.post(`/job-guide/downloads/${templateKey}`, {});
      return true;
    } catch (error) {
      console.error(`Failed to record download for ${templateKey}:`, error);
      return false;
    }
  },
};
