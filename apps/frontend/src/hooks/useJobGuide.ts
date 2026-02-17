import { useCallback, useEffect } from 'react';
import { useJobGuideStore } from '@/store/job-guide.store';
import { useAuthStore } from '@/store/auth.store';
import { useToastStore } from '@/store/toast.store';
import { jobGuideService } from '@/services/job-guide.service';
import type {
  UpdateProgressPayload,
  SetTargetDatePayload,
  CreateNotePayload,
  UpdateNotePayload,
  CreateCustomItemPayload,
  UpdateCustomItemPayload,
} from '@/types';

export function useJobGuide() {
  const {
    phases,
    overallProgress,
    isLoading,
    error,
    setPhases,
    setOverallProgress,
    setLoading,
    setError,
    updateItemCompletion,
    updateItemDisabled,
    updateItemTargetDate,
    updateItemNote,
    updatePhaseNote,
    addCustomItem,
    removeCustomItem,
  } = useJobGuideStore();

  /**
   * 전체 이직 가이드 데이터 로드
   */
  const loadJobGuide = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobGuideService.getFullJobGuide();
      if (data) {
        setPhases(data.phases);
        setOverallProgress(data.overallProgress);
      } else {
        setError('이직 가이드를 불러오는 데 실패했습니다.');
        useToastStore.getState().error('이직 가이드를 불러오는 데 실패했습니다.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(message);
      useToastStore.getState().error(message);
    } finally {
      setLoading(false);
    }
  }, [setPhases, setOverallProgress, setLoading, setError]);

  /**
   * 진행 상황 업데이트 (체크박스 토글)
   */
  const toggleItemCompletion = useCallback(
    async (itemCode: string, currentStatus: boolean) => {
      const newStatus = !currentStatus;
      const payload: UpdateProgressPayload = { isCompleted: newStatus };

      // 낙관적 업데이트
      updateItemCompletion(itemCode, newStatus);

      // API 호출
      const success = await jobGuideService.updateProgress(itemCode, payload);

      if (!success) {
        // 실패 시 롤백
        updateItemCompletion(itemCode, currentStatus);
        useToastStore.getState().error('진행 상황 업데이트에 실패했습니다.');
      }
    },
    [updateItemCompletion],
  );

  /**
   * 항목 비활성화 토글
   */
  const toggleItemDisabled = useCallback(
    async (itemCode: string, currentStatus: boolean) => {
      const newStatus = !currentStatus;

      // 낙관적 업데이트
      updateItemDisabled(itemCode, newStatus);

      // API 호출
      const success = await jobGuideService.toggleDisabled(itemCode);

      if (!success) {
        // 실패 시 롤백
        updateItemDisabled(itemCode, currentStatus);
        useToastStore.getState().error('항목 상태 변경에 실패했습니다.');
      }
    },
    [updateItemDisabled],
  );

  /**
   * 목표일 설정
   */
  const setTargetDate = useCallback(
    async (itemCode: string, targetDate: string | null) => {
      const payload: SetTargetDatePayload = { targetDate };

      // 낙관적 업데이트
      updateItemTargetDate(itemCode, targetDate);

      // API 호출
      const success = await jobGuideService.setTargetDate(itemCode, payload);

      if (!success) {
        // 실패 시 데이터 다시 로드
        await loadJobGuide();
        useToastStore.getState().error('목표일 설정에 실패했습니다.');
      } else {
        useToastStore.getState().success('목표일이 설정되었습니다.');
      }
    },
    [updateItemTargetDate, loadJobGuide],
  );

  /**
   * 메모 생성
   */
  const createNote = useCallback(
    async (payload: CreateNotePayload) => {
      const success = await jobGuideService.createNote(payload);

      if (success) {
        // 메모 생성 후 데이터 다시 로드
        await loadJobGuide();
        useToastStore.getState().success('메모가 저장되었습니다.');
      } else {
        useToastStore.getState().error('메모 저장에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  /**
   * 메모 수정
   */
  const updateNote = useCallback(
    async (noteId: number, payload: UpdateNotePayload) => {
      const success = await jobGuideService.updateNote(noteId, payload);

      if (success) {
        await loadJobGuide();
        useToastStore.getState().success('메모가 수정되었습니다.');
      } else {
        useToastStore.getState().error('메모 수정에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  /**
   * 메모 삭제
   */
  const deleteNote = useCallback(
    async (noteId: number) => {
      const success = await jobGuideService.deleteNote(noteId);

      if (success) {
        await loadJobGuide();
        useToastStore.getState().success('메모가 삭제되었습니다.');
      } else {
        useToastStore.getState().error('메모 삭제에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  /**
   * 커스텀 항목 추가
   */
  const createCustomItem = useCallback(
    async (payload: CreateCustomItemPayload) => {
      const success = await jobGuideService.createCustomItem(payload);

      if (success) {
        await loadJobGuide();
        useToastStore.getState().success('항목이 추가되었습니다.');
      } else {
        useToastStore.getState().error('항목 추가에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  /**
   * 커스텀 항목 수정
   */
  const updateCustomItem = useCallback(
    async (customItemId: number, payload: UpdateCustomItemPayload) => {
      const success = await jobGuideService.updateCustomItem(customItemId, payload);

      if (success) {
        await loadJobGuide();
        useToastStore.getState().success('항목이 수정되었습니다.');
      } else {
        useToastStore.getState().error('항목 수정에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  /**
   * 커스텀 항목 삭제
   */
  const deleteCustomItem = useCallback(
    async (customItemId: number) => {
      const success = await jobGuideService.deleteCustomItem(customItemId);

      if (success) {
        await loadJobGuide();
        useToastStore.getState().success('항목이 삭제되었습니다.');
      } else {
        useToastStore.getState().error('항목 삭제에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  /**
   * 커스텀 항목 완료 토글
   */
  const toggleCustomItemCompletion = useCallback(
    async (customItemId: number) => {
      const success = await jobGuideService.toggleCustomItemCompletion(customItemId);

      if (success) {
        await loadJobGuide();
      } else {
        useToastStore.getState().error('항목 완료 상태 변경에 실패했습니다.');
      }

      return success;
    },
    [loadJobGuide],
  );

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 컴포넌트 마운트 시 데이터 로드 (로그인된 경우만)
  useEffect(() => {
    if (isAuthenticated) {
      loadJobGuide();
    }
  }, [isAuthenticated, loadJobGuide]);

  return {
    // State
    phases,
    overallProgress,
    isLoading,
    error,
    // Actions
    loadJobGuide,
    toggleItemCompletion,
    toggleItemDisabled,
    setTargetDate,
    createNote,
    updateNote,
    deleteNote,
    createCustomItem,
    updateCustomItem,
    deleteCustomItem,
    toggleCustomItemCompletion,
  };
}
