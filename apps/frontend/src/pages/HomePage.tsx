import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

interface CategoryCard {
  title: string;
  description: string;
  href: string;
  emoji: string;
  gradient: string;
  features: string[];
}

const CATEGORIES: CategoryCard[] = [
  {
    title: '퇴사 시뮬레이터',
    description: '퇴직금, 실업급여, 생활비를 계산하고 퇴사 후 버틸 수 있는 기간을 확인',
    href: ROUTES.SIMULATOR,
    emoji: '🚀',
    gradient: 'from-brand-500 to-brand-600',
    features: ['퇴직금 계산', '실업급여 예측', '생존 기간 분석'],
  },
  {
    title: '연봉 계산기',
    description: '세전/세후 연봉, 4대보험, 소득세를 계산하여 월 실수령액 확인',
    href: '/salary-calculator',
    emoji: '💰',
    gradient: 'from-emerald-500 to-emerald-600',
    features: ['4대보험 계산', '소득세 계산', '실수령액 확인'],
  },
  {
    title: '퇴직연금 계산기',
    description: 'DB형/DC형 퇴직연금 예상 수령액을 비교하고 최적의 선택을 도와드립니다',
    href: '/pension-calculator',
    emoji: '🏦',
    gradient: 'from-amber-500 to-amber-600',
    features: ['DB vs DC 비교', '예상 수령액', '연금 시뮬레이션'],
  },
  {
    title: '이직 가이드',
    description: '이직의 모든 단계를 체크리스트로 관리하고 성공적인 이직을 준비하세요',
    href: '/job-guide',
    emoji: '📋',
    gradient: 'from-violet-500 to-violet-600',
    features: ['단계별 체크리스트', '진행률 관리', '실용적인 팁'],
  },
];

function HeroSection() {
  return (
    <section className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-sm font-medium mb-6">
        <span>✨</span>
        직장인을 위한 필수 계산기
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-4">
        퇴사와 이직,
        <br />
        <span className="gradient-text">계산부터 시작하세요</span>
      </h1>
      <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
        복잡한 계산은 HAN에게 맡기고, 당신은 새로운 시작에만 집중하세요.
        <br />
        모든 도구는 <strong>무료</strong>로 제공됩니다.
      </p>
    </section>
  );
}

function ToolCard({ category }: { category: CategoryCard }) {
  return (
    <Link
      to={category.href}
      className="group relative bg-white rounded-2xl border border-neutral-200 overflow-hidden no-underline card-hover"
    >
      {/* Gradient Top Bar */}
      <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />

      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
          >
            {category.emoji}
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-800 group-hover:text-brand-600 transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {category.features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className="text-sm font-medium text-brand-600 group-hover:text-brand-700">
            시작하기
          </span>
          <span className="text-brand-600 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function StatsSection() {
  const stats = [
    { value: '4개', label: '전문 도구' },
    { value: '100%', label: '무료 이용' },
    { value: '2024', label: '최신 기준' },
    { value: '∞', label: '무제한 사용' },
  ];

  return (
    <section className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-white my-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">왜 HAN을 선택해야 할까요?</h2>
        <p className="text-neutral-400">간편하고 정확한 계산, 그리고 무료</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-brand-400 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 page-enter">
      <HeroSection />

      {/* Tools Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <ToolCard key={cat.title} category={cat} />
          ))}
        </div>
      </section>

      <StatsSection />

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">
          지금 바로 시작해보세요
        </h2>
        <p className="text-neutral-500 mb-8">
          회원가입 없이도 모든 도구를 자유롭게 사용할 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTES.SIMULATOR}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            🚀 퇴사 시뮬레이터 시작
          </Link>
          <Link
            to="/salary-calculator"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
          >
            💰 연봉 계산기 사용
          </Link>
        </div>
      </section>
    </div>
  );
}
