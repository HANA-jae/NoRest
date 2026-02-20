'use client';

import { useState, useEffect } from 'react';
import { Question, ANSWER_OPTIONS, CATEGORIES } from '@/utils/quiz-data';
import { useQuizStore } from '@/store/quiz.store';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

interface QuestionCardProps {
  question: Question;
  selectedValue?: number;
}

export function QuestionCard({ question, selectedValue }: QuestionCardProps) {
  const { setAnswer, nextQuestion, prevQuestion, currentQuestion } = useQuizStore();
  const [selected, setSelected] = useState<number | undefined>(selectedValue);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const category = CATEGORIES.find((c) => c.id === question.category);

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue, question.id]);

  const handleSelect = (value: number) => {
    if (isTransitioning) return;

    setSelected(value);
    setAnswer(question.id, value);
    setIsTransitioning(true);

    setTimeout(() => {
      nextQuestion();
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl mx-auto w-full"
        >
          {/* Category label with subtle fade-in */}
          <FadeIn y={6} duration={0.3} delay={0.05}>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-4">
              {category?.name}
            </p>
          </FadeIn>

          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight mb-12">
            {question.text}
          </h2>

          {/* Answer option buttons with stagger */}
          <StaggerContainer
            key={`stagger-${currentQuestion}`}
            stagger={0.06}
            className="grid grid-cols-5 gap-2 md:gap-3"
          >
            {ANSWER_OPTIONS.map((option) => (
              <StaggerItem key={option.value}>
                <motion.button
                  onClick={() => handleSelect(option.value)}
                  disabled={isTransitioning}
                  whileTap={{ scale: 0.97 }}
                  className={`group flex flex-col items-center justify-center w-full py-4 md:py-6 rounded-xl border-2 transition-all ${
                    selected === option.value
                      ? 'border-neutral-900 bg-neutral-900 text-white scale-105'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:scale-102'
                  } ${isTransitioning ? 'pointer-events-none' : ''}`}
                >
                  <span className="text-lg md:text-xl font-bold">{option.label}</span>
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`text-sm transition-colors ${
                currentQuestion === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              ← 이전
            </button>

            <div className="flex gap-1">
              {ANSWER_OPTIONS.map((option) => (
                <span
                  key={option.value}
                  className={`text-[10px] ${
                    selected === option.value ? 'text-neutral-900' : 'text-neutral-300'
                  }`}
                >

                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
