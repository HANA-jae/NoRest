import { create } from 'zustand';
import type { JobGuidePhase, OverallProgress } from '@/types';

interface JobGuideState {
  // 데이터
  phases: JobGuidePhase[];
  overallProgress: OverallProgress | null;
  isLoading: boolean;
  error: string | null;

  // UI 상태
  activePhaseId: string;
  selectedItemCode: string | null;
  showDetailModal: boolean;
  showNoteEditor: boolean;
  showCustomItemForm: boolean;
  celebratingPhase: string | null;
  isAllPhasesComplete: boolean;

  // Data Actions
  setPhases: (phases: JobGuidePhase[]) => void;
  setOverallProgress: (progress: OverallProgress) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // 낙관적 업데이트: 항목 완료 토글
  updateItemCompletion: (itemCode: string, isCompleted: boolean) => void;

  // 낙관적 업데이트: 항목 비활성화 토글
  updateItemDisabled: (itemCode: string, isDisabled: boolean) => void;

  // 낙관적 업데이트: 목표일 설정
  updateItemTargetDate: (itemCode: string, targetDate: string | null) => void;

  // 낙관적 업데이트: 메모 업데이트
  updateItemNote: (itemCode: string, note: string | null) => void;

  // 낙관적 업데이트: 단계 메모 업데이트
  updatePhaseNote: (templateId: number, phaseNote: string | null) => void;

  // 낙관적 업데이트: 커스텀 항목 추가
  addCustomItem: (templateId: number, customItem: any) => void;

  // 낙관적 업데이트: 커스텀 항목 삭제
  removeCustomItem: (customItemId: number) => void;

  // UI Actions
  setActivePhaseId: (phaseId: string) => void;
  setSelectedItemCode: (itemCode: string | null) => void;
  setShowDetailModal: (show: boolean) => void;
  setShowNoteEditor: (show: boolean) => void;
  setShowCustomItemForm: (show: boolean) => void;
  setCelebratingPhase: (phase: string | null) => void;

  // 전체 진행률 재계산
  recalculateProgress: () => void;
}

export const useJobGuideStore = create<JobGuideState>((set, get) => ({
  // Initial state
  phases: [],
  overallProgress: null,
  isLoading: false,
  error: null,
  activePhaseId: 'preparation',
  selectedItemCode: null,
  showDetailModal: false,
  showNoteEditor: false,
  showCustomItemForm: false,
  celebratingPhase: null,
  isAllPhasesComplete: false,

  // Data Actions
  setPhases: (phases) => set({ phases }),

  setOverallProgress: (progress) => set({ overallProgress: progress }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // 낙관적 업데이트: 항목 완료 토글
  updateItemCompletion: (itemCode, isCompleted) => {
    const { phases } = get();
    const newPhases = phases.map((phase) => ({
      ...phase,
      items: phase.items.map((item) =>
        item.itemCode === itemCode
          ? {
              ...item,
              isCompleted,
              completedDate: isCompleted ? new Date().toISOString() : undefined,
            }
          : item,
      ),
    }));
    set({ phases: newPhases });
    get().recalculateProgress();
  },

  // 낙관적 업데이트: 항목 비활성화 토글
  updateItemDisabled: (itemCode, isDisabled) => {
    const { phases } = get();
    const newPhases = phases.map((phase) => ({
      ...phase,
      items: phase.items.map((item) =>
        item.itemCode === itemCode ? { ...item, isDisabled } : item,
      ),
    }));
    set({ phases: newPhases });
    get().recalculateProgress();
  },

  // 낙관적 업데이트: 목표일 설정
  updateItemTargetDate: (itemCode, targetDate) => {
    const { phases } = get();
    const newPhases = phases.map((phase) => ({
      ...phase,
      items: phase.items.map((item) =>
        item.itemCode === itemCode ? { ...item, targetDate: targetDate || undefined } : item,
      ),
    }));
    set({ phases: newPhases });
  },

  // 낙관적 업데이트: 메모 업데이트
  updateItemNote: (itemCode, note) => {
    const { phases } = get();
    const newPhases = phases.map((phase) => ({
      ...phase,
      items: phase.items.map((item) =>
        item.itemCode === itemCode ? { ...item, note: note || undefined } : item,
      ),
    }));
    set({ phases: newPhases });
  },

  // 낙관적 업데이트: 단계 메모 업데이트
  updatePhaseNote: (templateId, phaseNote) => {
    const { phases } = get();
    const newPhases = phases.map((phase) =>
      phase.templateId === templateId
        ? { ...phase, phaseNote: phaseNote || undefined }
        : phase,
    );
    set({ phases: newPhases });
  },

  // 낙관적 업데이트: 커스텀 항목 추가
  addCustomItem: (templateId, customItem) => {
    const { phases } = get();
    const newPhases = phases.map((phase) =>
      phase.templateId === templateId
        ? { ...phase, items: [...phase.items, customItem] }
        : phase,
    );
    set({ phases: newPhases });
    get().recalculateProgress();
  },

  // 낙관적 업데이트: 커스텀 항목 삭제
  removeCustomItem: (customItemId) => {
    const { phases } = get();
    const newPhases = phases.map((phase) => ({
      ...phase,
      items: phase.items.filter((item) => item.itemId !== customItemId),
    }));
    set({ phases: newPhases });
    get().recalculateProgress();
  },

  // UI Actions
  setActivePhaseId: (phaseId) => set({ activePhaseId: phaseId }),

  setSelectedItemCode: (itemCode) => set({ selectedItemCode: itemCode }),

  setShowDetailModal: (show) => set({ showDetailModal: show }),

  setShowNoteEditor: (show) => set({ showNoteEditor: show }),

  setShowCustomItemForm: (show) => set({ showCustomItemForm: show }),

  setCelebratingPhase: (phase) => set({ celebratingPhase: phase }),

  // 전체 진행률 재계산
  recalculateProgress: () => {
    const { phases } = get();
    let totalItems = 0;
    let completedItems = 0;

    phases.forEach((phase) => {
      phase.items.forEach((item) => {
        if (item.isDisabled) return;
        totalItems++;
        if (item.isCompleted) {
          completedItems++;
        }
      });
    });

    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    set({
      overallProgress: {
        totalItems,
        completedItems,
        progressPercentage,
      },
    });
  },
}));
