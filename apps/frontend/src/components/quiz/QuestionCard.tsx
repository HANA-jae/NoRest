import { useState, useEffect } from 'react';
import { Question, ANSWER_OPTIONS, CATEGORIES } from '@/utils/quiz-data';
import { useQuizStore } from '@/store/quiz.store';

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
      <div className="max-w-2xl mx-auto w-full">
        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-4">
          {category?.name}
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight mb-12">
          {question.text}
        </h2>

        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {ANSWER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={isTransitioning}
              className={`group flex flex-col items-center justify-center py-4 md:py-6 rounded-xl border-2 transition-all ${
                selected === option.value
                  ? 'border-neutral-900 bg-neutral-900 text-white scale-105'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:scale-102'
              } ${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              <span className="text-lg md:text-xl font-bold">{option.label}</span>
            </button>
          ))}
        </div>

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
      </div>
    </div>
  );
}
