import { create } from 'zustand';

interface UiState {
  isLoading: boolean;
  error: string | null;
  isLoginModalOpen: boolean;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isLoading: false,
  error: null,
  isLoginModalOpen: false,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  openLoginModal: () => set({ isLoginModalOpen: true, error: null }),
  closeLoginModal: () => set({ isLoginModalOpen: false, error: null }),
}));
