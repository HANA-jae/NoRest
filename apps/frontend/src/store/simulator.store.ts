import { create } from 'zustand';
import {
  calculate,
  type Step1Input,
  type Step3Input,
  type CalculationResults,
} from '@/utils/calculator';
import { useHistoryStore } from './history.store';

interface SimulatorState {
  // Step 1
  startDate: string;
  endDate: string;
  monthlySalary: number;
  hasSeverancePay: boolean;
  hasInterimSettlement: boolean;
  interimSettlementDate: string;
  insuranceMonths: number;
  resignationType: 'voluntary' | 'involuntary';
  age: number;

  // Step 3
  rent: number;
  living: number;
  insurance: number;
  other: number;
  restPeriod: number;

  // Results
  results: CalculationResults | null;

  // UI
  currentStep: number;

  // 히스토리 추적
  currentSimulationId: string | null;

  // Actions
  setStep1: (data: Partial<Step1Input>) => void;
  setStep3: (data: Partial<Step3Input>) => void;
  setCurrentStep: (step: number) => void;
  runCalculation: () => void;
  reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  startDate: '',
  endDate: new Date().toISOString().split('T')[0],
  monthlySalary: 0,
  hasSeverancePay: true,
  hasInterimSettlement: false,
  interimSettlementDate: '',
  insuranceMonths: 0,
  resignationType: 'involuntary',
  age: 30,

  rent: 500000,
  living: 800000,
  insurance: 0,
  other: 200000,
  restPeriod: 3,

  results: null,
  currentStep: 1,
  currentSimulationId: null,

  setStep1: (data) => set((state) => ({ ...state, ...data })),

  setStep3: (data) => {
    set((state) => ({ ...state, ...data }));
    // 자동 재계산
    setTimeout(() => get().runCalculation(), 0);
  },

  setCurrentStep: (step) => {
    const state = get();
    const prevStep = state.currentStep;

    set({ currentStep: step });

    // Step 1 → Step 2: 히스토리 레코드 생성
    if (prevStep === 1 && step === 2) {
      const id = useHistoryStore.getState().addSimulation({
        completedStep: 1,
        monthlySalary: state.monthlySalary,
        workingDays: state.results?.workingDays ?? 0,
        severancePay: state.results?.severancePay ?? 0,
        survivalDays: state.results?.survivalDays ?? 0,
        grade: state.results?.grade ?? '',
        percentile: state.results?.percentile ?? 0,
        step1Input: {
          startDate: state.startDate,
          monthlySalary: state.monthlySalary,
          age: state.age,
          insuranceMonths: state.insuranceMonths,
          hasSeverancePay: state.hasSeverancePay,
          resignationType: state.resignationType,
        },
      });
      set({ currentSimulationId: id });
    }

    // Step 3 → Step 4: 히스토리 레코드 업데이트 (최종 결과)
    if (prevStep === 3 && step === 4 && state.currentSimulationId && state.results) {
      useHistoryStore.getState().updateSimulation(state.currentSimulationId, {
        completedStep: 4,
        workingDays: state.results.workingDays,
        severancePay: state.results.severancePay,
        survivalDays: state.results.survivalDays,
        grade: state.results.grade,
        percentile: state.results.percentile,
        step3Input: {
          rent: state.rent,
          living: state.living,
          insurance: state.insurance,
          other: state.other,
          restPeriod: state.restPeriod,
        },
      });
    }
  },

  runCalculation: () => {
    const state = get();
    if (!state.startDate || !state.monthlySalary) return;

    const step1: Step1Input = {
      startDate: state.startDate,
      endDate: state.endDate,
      monthlySalary: state.monthlySalary,
      hasSeverancePay: state.hasSeverancePay,
      hasInterimSettlement: state.hasInterimSettlement,
      interimSettlementDate: state.interimSettlementDate,
      insuranceMonths: state.insuranceMonths,
      resignationType: state.resignationType,
      age: state.age,
    };

    const step3: Step3Input = {
      rent: state.rent,
      living: state.living,
      insurance: state.insurance,
      other: state.other,
      restPeriod: state.restPeriod,
    };

    const results = calculate(step1, step3);
    set({ results });
  },

  reset: () =>
    set({
      startDate: '',
      monthlySalary: 0,
      hasSeverancePay: true,
      hasInterimSettlement: false,
      interimSettlementDate: '',
      insuranceMonths: 0,
      resignationType: 'involuntary',
      age: 30,
      rent: 500000,
      living: 800000,
      insurance: 0,
      other: 200000,
      restPeriod: 3,
      results: null,
      currentStep: 1,
      currentSimulationId: null,
    }),
}));
