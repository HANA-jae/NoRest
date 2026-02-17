'use client';

import Link from 'next/link';
import { useQuizStore } from '@/store/quiz.store';
import { CATEGORIES, CategoryId } from '@/utils/quiz-data';
import {
  FadeIn,
  ScaleIn,
  CountUp,
  AnimatedProgress,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

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
        <ScaleIn delay={0.2}>
          <div className="text-center mb-10">
            <div
              className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${gradeInfo.bgColor} text-white mb-6`}
            >
              <span className="text-4xl font-bold">
                <CountUp end={score} duration={1.5} delay={0.4} />
              </span>
            </div>
            <FadeIn delay={0.5} y={12}>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {gradeInfo.title}
              </h1>
              <p className="text-neutral-500">{gradeInfo.subtitle}</p>
            </FadeIn>
          </div>
        </ScaleIn>

        {/* Description */}
        <FadeIn delay={0.6} y={16}>
          <div className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200">
            <p className="text-lg text-neutral-700 leading-relaxed">
              {gradeInfo.description}
            </p>
          </div>
        </FadeIn>

        {/* Category Analysis */}
        <FadeIn delay={0.7} y={16}>
          <div className="bg-white rounded-2xl p-6 mb-6 border border-neutral-200">
            <h3 className="text-xs text-neutral-400 uppercase tracking-wider mb-4">
              카테고리별 분석
            </h3>
            <StaggerContainer stagger={0.12}>
              <div className="space-y-4">
                {sortedCategories.map((category, idx) => (
                  <StaggerItem key={category.id}>
                    <CategoryBar
                      name={category.name}
                      score={categoryScores[category.id]}
                      index={idx}
                    />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* Actions */}
        <FadeIn delay={0.9} y={16}>
          <div className="bg-white rounded-2xl p-6 mb-8 border border-neutral-200">
            <h3 className="text-xs text-neutral-400 uppercase tracking-wider mb-4">
              추천 액션
            </h3>
            <StaggerContainer stagger={0.1}>
              <ul className="space-y-3">
                {gradeInfo.actions.map((action, i) => (
                  <StaggerItem key={i}>
                    <li className="flex items-start gap-3">
                      <span className="text-xs text-neutral-300 tabular-nums mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-neutral-700">{action}</span>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* Buttons */}
        <FadeIn delay={1.2} y={12}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 py-4 px-6 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
            >
              다시 테스트하기
            </button>
            <Link
              href="/simulator"
              className="flex-1 py-4 px-6 bg-white text-neutral-900 border border-neutral-200 rounded-full font-medium text-center hover:bg-neutral-50 transition-colors"
            >
              퇴사 시뮬레이터 →
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={1.4} y={8}>
          <p className="text-xs text-neutral-400 text-center mt-8">
            본 테스트는 참고용입니다. 중요한 결정은 신중하게 내려주세요.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

function CategoryBar({
  name,
  score,
  index,
}: {
  name: string;
  score: number;
  index: number;
}) {
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const barDelay = 0.8 + index * 0.12;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-neutral-600">{name}</span>
        <span className="text-sm font-medium text-neutral-900 tabular-nums">
          <CountUp end={score} duration={0.8} delay={barDelay} suffix="%" />
        </span>
      </div>
      <AnimatedProgress
        value={score}
        delay={barDelay}
        duration={0.8}
        className="h-2 bg-neutral-100 rounded-full overflow-hidden"
        barClassName={`h-full rounded-full ${getBarColor(score)}`}
      />
    </div>
  );
}
