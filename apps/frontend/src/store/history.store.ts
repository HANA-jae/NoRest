import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './auth.store';
import { simulationService, type SimulationPayload } from '@/services/simulation.service';

export interface Step1Input {
  startDate: string;
  monthlySalary: number;
  age: number;
  insuranceMonths: number;
  hasSeverancePay: boolean;
  resignationType: 'voluntary' | 'involuntary';
}

export interface Step3Input {
  rent: number;
  living: number;
  insurance: number;
  other: number;
  restPeriod: number;
}

export interface SimulationHistoryItem {
  id: string;
  date: string;
  // 기존 필드 (하위 호환)
  monthlySalary: number;
  workingDays: number;
  severancePay: number;
  survivalDays: number;
  grade: string;
  percentile: number;
  // 유저별 관리
  userId?: string;
  // Step별 저장
  completedStep: number;
  step1Input?: Step1Input;
  step3Input?: Step3Input;
  // 서버 동기화
  serverId?: string;
}

type AddSimulationInput = Omit<SimulationHistoryItem, 'id' | 'date' | 'userId'>;

interface HistoryState {
  simulations: SimulationHistoryItem[];
  addSimulation: (item: AddSimulationInput) => string;
  updateSimulation: (id: string, updates: Partial<SimulationHistoryItem>) => void;
  removeSimulation: (id: string) => void;
  clearHistory: () => void;
  getUserSimulations: () => SimulationHistoryItem[];
  loadFromServer: () => Promise<void>;
}

function getCurrentUserId(): string | undefined {
  return useAuthStore.getState().user?.id;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      simulations: [],

      addSimulation: (item) => {
        const userId = getCurrentUserId();
        const newItem: SimulationHistoryItem = {
          ...item,
          id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          date: new Date().toISOString(),
          userId,
        };

        set((state) => ({
          simulations: [newItem, ...state.simulations].slice(0, 50),
        }));

        // 서버 저장 시도 (비동기, 실패해도 무시)
        if (userId) {
          const payload: SimulationPayload = {
            userId,
            completedStep: newItem.completedStep,
            step1Input: newItem.step1Input,
            step3Input: newItem.step3Input,
            results: newItem.workingDays ? {
              workingDays: newItem.workingDays,
              severancePay: newItem.severancePay,
              survivalDays: newItem.survivalDays,
              survivalMonths: 0,
              grade: newItem.grade,
              percentile: newItem.percentile,
              totalBenefit: 0,
              estimatedTaxRefund: 0,
              totalSavings: 0,
              totalMonthlyExpense: 0,
            } : undefined,
          };
          simulationService.save(payload).then((record) => {
            if (record) {
              // 서버 ID 연결
              set((state) => ({
                simulations: state.simulations.map((s) =>
                  s.id === newItem.id ? { ...s, serverId: record.id } : s,
                ),
              }));
            }
          });
        }

        return newItem.id;
      },

      updateSimulation: (id, updates) => {
        set((state) => ({
          simulations: state.simulations.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        }));

        // 서버 업데이트 시도
        const userId = getCurrentUserId();
        if (userId) {
          const item = get().simulations.find((s) => s.id === id);
          if (item) {
            const payload: SimulationPayload = {
              userId,
              completedStep: updates.completedStep ?? item.completedStep,
              step1Input: updates.step1Input ?? item.step1Input,
              step3Input: updates.step3Input ?? item.step3Input,
              results: {
                workingDays: updates.workingDays ?? item.workingDays,
                severancePay: updates.severancePay ?? item.severancePay,
                survivalDays: updates.survivalDays ?? item.survivalDays,
                survivalMonths: 0,
                grade: updates.grade ?? item.grade,
                percentile: updates.percentile ?? item.percentile,
                totalBenefit: 0,
                estimatedTaxRefund: 0,
                totalSavings: 0,
                totalMonthlyExpense: 0,
              },
            };
            simulationService.save(payload);
          }
        }
      },

      removeSimulation: (id) => {
        const item = get().simulations.find((s) => s.id === id);
        set((state) => ({
          simulations: state.simulations.filter((s) => s.id !== id),
        }));
        // 서버에서도 삭제 시도
        if (item?.serverId) {
          simulationService.delete(item.serverId);
        }
      },

      clearHistory: () => {
        set({ simulations: [] });
      },

      getUserSimulations: () => {
        const userId = getCurrentUserId();
        const { simulations } = get();
        if (!userId) return simulations;
        return simulations.filter((s) => s.userId === userId);
      },

      loadFromServer: async () => {
        const userId = getCurrentUserId();
        if (!userId) return;

        const serverData = await simulationService.getMyList();
        if (!serverData || serverData.length === 0) return;

        // 서버 데이터를 로컬 형식으로 변환 후 머지
        const serverItems: SimulationHistoryItem[] = serverData.map((record) => ({
          id: `srv-${record.id}`,
          date: record.createdAt,
          monthlySalary: record.step1Input?.monthlySalary ?? 0,
          workingDays: record.results?.workingDays ?? 0,
          severancePay: record.results?.severancePay ?? 0,
          survivalDays: record.results?.survivalDays ?? 0,
          grade: record.results?.grade ?? '',
          percentile: record.results?.percentile ?? 0,
          userId,
          completedStep: record.completedStep,
          step1Input: record.step1Input,
          step3Input: record.step3Input,
          serverId: record.id,
        }));

        set((state) => {
          // 서버 데이터와 로컬 데이터 머지 (서버 ID로 중복 제거)
          const localOnly = state.simulations.filter(
            (local) => !local.serverId || !serverItems.some((srv) => srv.serverId === local.serverId),
          );
          const merged = [...serverItems, ...localOnly]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 50);
          return { simulations: merged };
        });
      },
    }),
    {
      name: 'han-simulation-history',
      skipHydration: true,
    },
  ),
);
