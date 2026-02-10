'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { StepIndicator } from './StepIndicator';

interface Props {
  children: ReactNode;
}

export function SimulatorLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 상단 헤더 */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link href="/" className="text-neutral-400 text-sm hover:text-neutral-600 transition-colors no-underline">
            ← 돌아가기
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 tracking-tight">
            퇴사 시뮬레이터
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            퇴사 후 재정 상황을 미리 계산해보세요
          </p>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <StepIndicator />
        {children}
      </main>

      {/* 법적 고지 */}
      <footer className="border-t border-neutral-100 mt-auto">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <p className="text-xs text-neutral-300 leading-relaxed">
            본 시뮬레이터의 계산 결과는 참고용이며, 실제 퇴직금/실업급여/보험료와
            다를 수 있습니다. 정확한 금액은 고용노동부, 국민연금공단,
            국민건강보험공단에서 확인하세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
