'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

const TOOLS = [
  {
    title: '퇴사 시뮬레이터',
    desc: '퇴직금, 실업급여, 생존 기간',
    href: '/simulator',
    num: '01',
  },
  {
    title: '퇴사각 테스트',
    desc: '나의 퇴사 필요도 진단',
    href: '/resignation-quiz',
    num: '02',
  },
  {
    title: '연봉 계산기',
    desc: '4대보험, 소득세, 실수령액',
    href: '/salary-calculator',
    num: '03',
  },
  {
    title: '퇴직연금 계산기',
    desc: 'DB형 vs DC형 비교 분석',
    href: '/pension-calculator',
    num: '04',
  },
  {
    title: '이직 가이드',
    desc: '단계별 체크리스트',
    href: '/job-guide',
    num: '05',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <FadeIn delay={0.1} y={0}>
              <p className="text-sm text-neutral-400 mb-4 tracking-wide">

              </p>
            </FadeIn>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-6">
              <FadeIn delay={0.15} y={12}>
                <span className="block">그만둘까.</span>
              </FadeIn>
              <FadeIn delay={0.3} y={12}>
                <span className="block">
                  <span className="text-gray-500">감정</span>은 잠시 두고, <span className="text-red-400">숫자</span>부터
                </span>
              </FadeIn>
              <FadeIn delay={0.45} y={12}>
                <span className="block text-4xl text-neutral-400">
                  퇴사 전, 필요한 계산.
                </span>
              </FadeIn>
            </h1>
            <FadeIn delay={0.6}>
              <p className="text-lg text-neutral-600 mb-10 max-w-md">
                퇴사, 이직, 연봉 협상에 필요한 계산을 현실 기준으로.<br />
                감정보다 기준이 먼저입니다.<br />
              </p>
            </FadeIn>
            <FadeIn delay={0.8}>
              <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Link
                  href="/simulator"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 transition-all"
                >
                  <span>생존 기간 계산 시작</span>
                  <span className="text-neutral-400">→</span>
                </Link>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-t border-neutral-200">
        <StaggerContainer className="max-w-6xl mx-auto" stagger={0.08}>
          {TOOLS.map((tool) => (
            <StaggerItem key={tool.href}>
              <Link
                href={tool.href}
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
                <motion.span
                  className="text-neutral-300 group-hover:text-neutral-900 transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  →
                </motion.span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
