import { QUESTIONS } from '@/utils/quiz-data';

interface QuizProgressProps {
  current: number;
}

export function QuizProgress({ current }: QuizProgressProps) {
  const total = QUESTIONS.length;
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-400 tabular-nums">
            {current + 1} / {total}
          </span>
          <span className="text-xs text-neutral-400 tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
