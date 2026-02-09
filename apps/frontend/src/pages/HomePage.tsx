import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

const TOOLS = [
  {
    title: '퇴사 시뮬레이터',
    desc: '퇴직금, 실업급여, 생존 기간',
    href: ROUTES.SIMULATOR,
    num: '01',
  },
  {
    title: '연봉 계산기',
    desc: '4대보험, 소득세, 실수령액',
    href: ROUTES.SALARY_CALCULATOR,
    num: '02',
  },
  {
    title: '퇴직연금 계산기',
    desc: 'DB형 vs DC형 비교 분석',
    href: ROUTES.PENSION_CALCULATOR,
    num: '03',
  },
  {
    title: '이직 가이드',
    desc: '단계별 체크리스트',
    href: ROUTES.JOB_GUIDE,
    num: '04',
  },
];

export function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm text-neutral-400 mb-4 tracking-wide">
              Financial Tools for Workers
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-6">
              복잡한 계산,
              <br />
              <span className="text-neutral-400">우리가 대신합니다</span>
            </h1>
            <p className="text-lg text-neutral-500 mb-10 max-w-md">
              퇴사, 이직, 연봉 협상에 필요한 모든 계산을 정확하고 빠르게.
            </p>
            <Link
              to={ROUTES.SIMULATOR}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              <span>시작하기</span>
              <span className="text-neutral-400">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          {TOOLS.map((tool, i) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="group flex items-center justify-between px-6 py-6 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-8">
                <span className="text-xs text-neutral-300 tabular-nums w-6">
                  {tool.num}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-0.5">{tool.desc}</p>
                </div>
              </div>
              <span className="text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
