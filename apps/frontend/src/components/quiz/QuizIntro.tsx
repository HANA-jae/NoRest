import { useQuizStore } from '@/store/quiz.store';
import { QUESTIONS } from '@/utils/quiz-data';

export function QuizIntro() {
  const { setPhase } = useQuizStore();

  const handleStart = () => {
    setPhase('questions');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm text-neutral-400 mb-4 tracking-wide">
          Resignation Readiness Test
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-6">
          퇴사각
          <br />
          테스트
        </h1>
        <p className="text-lg text-neutral-500 mb-10 max-w-md mx-auto">
          {QUESTIONS.length}개의 질문으로 나의 퇴사 필요도를 진단합니다.
          솔직하게 답변해주세요.
        </p>

        <button
          onClick={handleStart}
          className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors"
        >
          <span>시작하기</span>
          <span className="text-neutral-400">→</span>
        </button>

        <p className="text-xs text-neutral-400 mt-8">약 2분 소요</p>
      </div>
    </div>
  );
}
