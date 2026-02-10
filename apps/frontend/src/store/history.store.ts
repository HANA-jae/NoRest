import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SimulationHistoryItem {
  id: string;
  date: string;
  monthlySalary: number;
  workingDays: number;
  severancePay: number;
  survivalDays: number;
  grade: string;
  percentile: number;
}

interface HistoryState {
  simulations: SimulationHistoryItem[];
  addSimulation: (item: Omit<SimulationHistoryItem, 'id' | 'date'>) => void;
  removeSimulation: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      simulations: [],

      addSimulation: (item) => {
        const newItem: SimulationHistoryItem = {
          ...item,
          id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          date: new Date().toISOString(),
        };
        set((state) => ({
          simulations: [newItem, ...state.simulations].slice(0, 10), // Keep last 10
        }));
      },

      removeSimulation: (id) => {
        set((state) => ({
          simulations: state.simulations.filter((s) => s.id !== id),
        }));
      },

      clearHistory: () => {
        set({ simulations: [] });
      },
    }),
    {
      name: 'han-simulation-history',
      skipHydration: true,
    }
  )
);
