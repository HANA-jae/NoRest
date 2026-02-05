import { create } from 'zustand';
import {
  calculate,
  type Step1Input,
  type Step3Input,
  type CalculationResults,
} from '@/utils/calculator';

interface SimulatorState {
  // Step 1
  startDate: string;
  monthlySalary: number;
  hasSeverancePay: boolean;
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

  // Actions
  setStep1: (data: Partial<Step1Input>) => void;
  setStep3: (data: Partial<Step3Input>) => void;
  setCurrentStep: (step: number) => void;
  runCalculation: () => void;
  reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  startDate: '',
  monthlySalary: 0,
  hasSeverancePay: true,
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

  setStep1: (data) => set((state) => ({ ...state, ...data })),

  setStep3: (data) => {
    set((state) => ({ ...state, ...data }));
    // 자동 재계산
    setTimeout(() => get().runCalculation(), 0);
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  runCalculation: () => {
    const state = get();
    if (!state.startDate || !state.monthlySalary) return;

    const step1: Step1Input = {
      startDate: state.startDate,
      monthlySalary: state.monthlySalary,
      hasSeverancePay: state.hasSeverancePay,
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
    }),
}));
