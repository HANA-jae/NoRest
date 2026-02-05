import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

interface CategoryCard {
  title: string;
  description: string;
  href: string;
  ready: boolean;
  tag?: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: '퇴사 시뮬레이터',
    description: '퇴직금, 실업급여, 생활비를 계산하고 퇴사 후 버틸 수 있는 기간을 확인',
    href: ROUTES.SIMULATOR,
    ready: true,
  },
  {
    title: '연봉 계산기',
    description: '세전/세후 연봉, 월 실수령액을 한눈에 계산',
    href: '#',
    ready: false,
    tag: '준비 중',
  },
  {
    title: '이직 가이드',
    description: '이직 시 체크리스트와 타임라인을 정리',
    href: '#',
    ready: false,
    tag: '준비 중',
  },
  {
    title: '퇴직연금 계산기',
    description: 'DB형/DC형 퇴직연금 예상 수령액 비교',
    href: '#',
    ready: false,
    tag: '준비 중',
  },
];

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          도구 모음
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          직장인을 위한 계산기와 가이드
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) =>
          cat.ready ? (
            <Link
              key={cat.title}
              to={cat.href}
              className="group block p-6 bg-white border border-neutral-200 rounded-2xl no-underline hover:border-neutral-400 transition-all"
            >
              <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {cat.description}
              </p>
              <span className="inline-block mt-4 text-xs font-medium text-neutral-900 tracking-wide">
                시작하기 &rarr;
              </span>
            </Link>
          ) : (
            <div
              key={cat.title}
              className="p-6 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl opacity-60"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-400">
                  {cat.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium text-neutral-400 bg-neutral-100 rounded-full">
                  {cat.tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
