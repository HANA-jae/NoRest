import { create } from 'zustand';
import { QUESTIONS, getQuizResult, QuizResult } from '@/utils/quiz-data';

type QuizPhase = 'intro' | 'questions' | 'result';

interface QuizState {
  phase: QuizPhase;
  currentQuestion: number;
  answers: Record<number, number>;

  setPhase: (phase: QuizPhase) => void;
  setAnswer: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  reset: () => void;
  getResult: () => QuizResult | null;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  phase: 'intro',
  currentQuestion: 0,
  answers: {},

  setPhase: (phase) => set({ phase }),

  setAnswer: (questionId, value) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: value },
    }));
  },

  nextQuestion: () => {
    const { currentQuestion, answers } = get();
    const nextIndex = currentQuestion + 1;

    if (nextIndex >= QUESTIONS.length) {
      set({ phase: 'result' });
    } else {
      set({ currentQuestion: nextIndex });
    }
  },

  prevQuestion: () => {
    const { currentQuestion } = get();
    if (currentQuestion > 0) {
      set({ currentQuestion: currentQuestion - 1 });
    }
  },

  reset: () => {
    set({
      phase: 'intro',
      currentQuestion: 0,
      answers: {},
    });
  },

  getResult: () => {
    const { answers } = get();
    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) return null;
    return getQuizResult(answers);
  },
}));
