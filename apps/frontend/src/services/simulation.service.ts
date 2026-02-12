import { apiClient } from '@/lib/api-client';

export interface SimulationPayload {
  userId?: string;
  completedStep: number;
  step1Input?: {
    startDate: string;
    monthlySalary: number;
    age: number;
    insuranceMonths: number;
    hasSeverancePay: boolean;
    resignationType: 'voluntary' | 'involuntary';
  };
  step3Input?: {
    rent: number;
    living: number;
    insurance: number;
    other: number;
    restPeriod: number;
  };
  results?: {
    workingDays: number;
    severancePay: number;
    survivalDays: number;
    survivalMonths: number;
    grade: string;
    percentile: number;
    totalBenefit: number;
    estimatedTaxRefund: number;
    totalSavings: number;
    totalMonthlyExpense: number;
  };
}

export interface SimulationRecord extends SimulationPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export const simulationService = {
  /** 시뮬레이션 저장 (생성 또는 업데이트) */
  async save(data: SimulationPayload): Promise<SimulationRecord | null> {
    try {
      const res = await apiClient.post<ApiEnvelope<SimulationRecord>>(
        '/simulations',
        data,
      );
      return res.data;
    } catch {
      // 백엔드 미구현 시 null 반환 → localStorage 폴백
      return null;
    }
  },

  /** 내 시뮬레이션 목록 조회 */
  async getMyList(): Promise<SimulationRecord[] | null> {
    try {
      const res = await apiClient.get<ApiEnvelope<SimulationRecord[]>>(
        '/simulations/me',
      );
      return res.data;
    } catch {
      return null;
    }
  },

  /** 시뮬레이션 삭제 */
  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/simulations/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};
