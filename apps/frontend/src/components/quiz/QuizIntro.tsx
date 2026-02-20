'use client';

import { useQuizStore } from '@/store/quiz.store';
import { QUESTIONS } from '@/utils/quiz-data';
import { motion } from 'framer-motion';

function FloatingQuestion() {
  return (
    <div className="relative mb-8 flex justify-center">
      {/* Soft glow */}
      <motion.div
        className="absolute mx-auto w-24 h-24 rounded-full bg-neutral-900/5 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Icon */}
      <motion.div
        className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center shadow-lg shadow-neutral-900/20"
        initial={{ opacity: 0, y: 20, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.span
          className="text-4xl font-bold text-white select-none"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ?
        </motion.span>

        {/* Accent dot */}
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
        />
      </motion.div>
    </div>
  );
}

export function QuizIntro() {
  const { setPhase } = useQuizStore();

  const handleStart = () => {
    setPhase('questions');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12">
      <div className="max-w-xl mx-auto text-center">
        <FloatingQuestion />

        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
          퇴사각
          <br />
          테스트
        </h1>
        <p className="text-lg text-neutral-500 mb-10 max-w-md mx-auto">
          당신은 지금 감정적 퇴사모드인가요? <br/>전략적 퇴사모드인가요?
        </p>

        <button
          onClick={handleStart}
          className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors"
        >
          <span>시작하기</span>
          <span className="text-neutral-400">→</span>
        </button>

        <p className="text-xs text-neutral-400 mt-8">약 {QUESTIONS.length * 0.5}분 소요</p>
      </div>
    </div>
  );
}
