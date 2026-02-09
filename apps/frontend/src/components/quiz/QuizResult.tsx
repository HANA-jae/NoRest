import { Link } from 'react-router-dom';
import { useQuizStore } from '@/store/quiz.store';
import { CATEGORIES, CategoryId } from '@/utils/quiz-data';
import { ROUTES } from '@/router/routes';

export function QuizResult() {
  const { getResult, reset } = useQuizStore();
  const result = getResult();

  if (!result) return null;

  const { score, gradeInfo, categoryScores } = result;

  const sortedCategories = [...CATEGORIES].sort(
    (a, b) => categoryScores[b.id] - categoryScores[a.id]
  );

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Score Badge */}
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${gradeInfo.bgColor} text-white mb-6`}
          >
            <span className="text-4xl font-bold">{score}</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {gradeInfo.title}
          </h1>
          <p className="text-neutral-500">{gradeInfo.subtitle}</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200">
          <p className="text-lg text-neutral-700 leading-relaxed">
            {gradeInfo.description}
          </p>
        </div>

        {/* Category Analysis */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200">
          <h3 className="text-xs text-neutral-400 uppercase tracking-wider mb-4">
            카테고리별 분석
          </h3>
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <CategoryBar
                key={category.id}
                name={category.name}
                score={categoryScores[category.id]}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-neutral-200">
          <h3 className="text-xs text-neutral-400 uppercase tracking-wider mb-4">
            추천 액션
          </h3>
          <ul className="space-y-3">
            {gradeInfo.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-xs text-neutral-300 tabular-nums mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-neutral-700">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 py-4 px-6 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
          >
            다시 테스트하기
          </button>
          <Link
            to={ROUTES.SIMULATOR}
            className="flex-1 py-4 px-6 bg-white text-neutral-900 border border-neutral-200 rounded-full font-medium text-center hover:bg-neutral-50 transition-colors"
          >
            퇴사 시뮬레이터 →
          </Link>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-8">
          본 테스트는 참고용입니다. 중요한 결정은 신중하게 내려주세요.
        </p>
      </div>
    </div>
  );
}

function CategoryBar({ name, score }: { name: string; score: number }) {
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-neutral-600">{name}</span>
        <span className="text-sm font-medium text-neutral-900 tabular-nums">
          {score}%
        </span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
