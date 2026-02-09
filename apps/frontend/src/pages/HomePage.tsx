import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

interface Tool {
  title: string;
  description: string;
  href: string;
  features: string[];
}

const TOOLS: Tool[] = [
  {
    title: '퇴사 시뮬레이터',
    description: '퇴직금, 실업급여, 생활비를 계산하고 퇴사 후 생존 가능 기간을 분석합니다.',
    href: ROUTES.SIMULATOR,
    features: ['퇴직금 계산', '실업급여 예측', '생존 기간 분석'],
  },
  {
    title: '연봉 계산기',
    description: '4대보험과 소득세를 적용한 실수령액을 정확하게 계산합니다.',
    href: ROUTES.SALARY_CALCULATOR,
    features: ['4대보험 계산', '소득세 계산', '실수령액 확인'],
  },
  {
    title: '퇴직연금 계산기',
    description: 'DB형과 DC형 퇴직연금을 비교하고 예상 수령액을 시뮬레이션합니다.',
    href: ROUTES.PENSION_CALCULATOR,
    features: ['DB vs DC 비교', '예상 수령액', '연금 시뮬레이션'],
  },
  {
    title: '이직 가이드',
    description: '이직의 전 과정을 체계적으로 관리할 수 있는 체크리스트를 제공합니다.',
    href: ROUTES.JOB_GUIDE,
    features: ['단계별 체크리스트', '진행률 관리', '실용적 팁'],
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to={tool.href}
      className="group block bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 hover:shadow-sm transition-all"
    >
      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700 mb-2">
        {tool.title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">
        {tool.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tool.features.map((feature) => (
          <span
            key={feature}
            className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md"
          >
            {feature}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          직장인을 위한 재정 계산 도구
        </h1>
        <p className="text-neutral-500">
          퇴사, 이직, 연봉 협상에 필요한 정확한 계산을 제공합니다.
        </p>
      </header>

      {/* Tools Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </section>

      {/* Info Section */}
      <section className="border-t border-neutral-200 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl font-semibold text-neutral-900">4</p>
            <p className="text-sm text-neutral-500 mt-1">전문 도구</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900">2024</p>
            <p className="text-sm text-neutral-500 mt-1">기준 적용</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900">무료</p>
            <p className="text-sm text-neutral-500 mt-1">이용 가능</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-neutral-900">무제한</p>
            <p className="text-sm text-neutral-500 mt-1">사용 횟수</p>
          </div>
        </div>
      </section>
    </div>
  );
}
