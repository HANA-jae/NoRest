'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calculatePension,
  formatMillion,
  formatFullCurrency,
} from '@/utils/pension-calculator';
import { AnimatePresence } from 'framer-motion';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  ScaleIn,
  CountUp,
  AnimatedProgress,
} from '@/components/motion';

export default function PensionCalculatorPage() {
  const [monthlySalary, setMonthlySalary] = useState<string>('3500000');
  const [yearsOfService, setYearsOfService] = useState<number>(10);
  const [returnRate, setReturnRate] = useState<number>(3);

  const salary = parseInt(monthlySalary.replace(/,/g, ''), 10) || 0;

  const result = useMemo(() => {
    if (salary <= 0 || yearsOfService <= 0) return null;
    return calculatePension({
      monthlySalary: salary,
      yearsOfService,
      pensionType: 'DB',
      expectedReturnRate: returnRate,
    });
  }, [salary, yearsOfService, returnRate]);

  const formatInputCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR').format(value);

  const maxEstimate = result
    ? Math.max(result.dbEstimate, result.dcEstimate)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* 1. Page header: FadeIn with stagger */}
      <StaggerContainer stagger={0.1}>
        <StaggerItem>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 mb-8 sm:mb-12 transition-colors"
          >
            <span>&larr;</span>
            <span>Back</span>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">
            퇴직연금 계산기
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="text-sm sm:text-base text-neutral-500 mb-6 sm:mb-10">
            DB형(확정급여)과 DC형(확정기여)을 한눈에 비교하세요
          </p>
        </StaggerItem>
      </StaggerContainer>

      {/* 2. Input fields: FadeIn delay 0.2 */}
      <FadeIn delay={0.2}>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-2">
              월급
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatInputCurrency(salary)}
                onChange={(e) => setMonthlySalary(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-neutral-200 focus:border-neutral-900 pb-3 pr-8 outline-none transition-colors tabular-nums"
              />
              <span className="absolute right-0 bottom-3 text-lg text-neutral-300">원</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-2">
              근속 기간
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={40}
                value={yearsOfService}
                onChange={(e) => setYearsOfService(parseInt(e.target.value, 10) || 1)}
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-neutral-200 focus:border-neutral-900 pb-3 pr-8 outline-none transition-colors"
              />
              <span className="absolute right-0 bottom-3 text-lg text-neutral-300">년</span>
            </div>
          </div>

          {/* 3. DC return rate slider: FadeIn delay 0.3 */}
          <FadeIn delay={0.3}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-neutral-400 uppercase tracking-wider">
                  DC 예상 수익률
                </label>
                <span className="text-lg font-bold text-neutral-900">{returnRate}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-neutral-900 mt-4"
              />
              <div className="flex justify-between text-xs text-neutral-300 mt-1">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        {result ? (
          /* 4. Results section: FadeIn wrapper */
          <FadeIn key="results">
            <>
              {/* DB vs DC Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* 5. DB Card: SlideIn from left delay 0.2 */}
                <SlideIn direction="left" delay={0.2}>
                  <div className="bg-neutral-900 text-white rounded-2xl p-5 sm:p-8">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <span className="text-xs font-semibold bg-white text-neutral-900 px-2.5 py-1 rounded-full">DB형</span>
                      <span className="text-xs text-neutral-400">확정급여형</span>
                    </div>
                    {/* 8. CountUp for DB estimate */}
                    <p className="text-2xl sm:text-4xl font-bold tracking-tight tabular-nums mb-1">
                      <CountUp
                        end={Math.round(result.dbEstimate / 10000)}
                        duration={1.2}
                        delay={0.4}
                        suffix="만"
                      />
                      <span className="text-xl text-neutral-400 ml-1">원</span>
                    </p>
                    <p className="text-neutral-400 text-sm mb-8">
                      {formatFullCurrency(result.dbEstimate)}
                    </p>

                    {/* 7. Detail rows: StaggerContainer + StaggerItem */}
                    <StaggerContainer stagger={0.06} className="space-y-3 border-t border-neutral-800 pt-6">
                      <StaggerItem>
                        <DetailRow label="계산 방식" value="평균임금 × 근속연수" light />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow label="1일 평균임금" value={formatFullCurrency(salary / 30)} light />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow label="근속연수" value={`${yearsOfService}년`} light />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow
                          label="월 연금 (10년 수령)"
                          value={formatFullCurrency(result.dbMonthlyPension)}
                          light
                          highlight
                        />
                      </StaggerItem>
                    </StaggerContainer>

                    <div className="mt-6 pt-4 border-t border-neutral-800">
                      <p className="text-xs text-neutral-400">
                        퇴직 시점 급여 기준으로 확정. 임금 상승 시 유리합니다.
                      </p>
                    </div>
                  </div>
                </SlideIn>

                {/* 6. DC Card: SlideIn from right delay 0.4 */}
                <SlideIn direction="right" delay={0.4}>
                  <div className="border-2 border-neutral-200 rounded-2xl p-5 sm:p-8">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <span className="text-xs font-semibold bg-neutral-900 text-white px-2.5 py-1 rounded-full">DC형</span>
                      <span className="text-xs text-neutral-400">확정기여형</span>
                    </div>
                    {/* 8. CountUp for DC estimate */}
                    <p className="text-2xl sm:text-4xl font-bold tracking-tight tabular-nums text-neutral-900 mb-1">
                      <CountUp
                        end={Math.round(result.dcEstimate / 10000)}
                        duration={1.2}
                        delay={0.6}
                        suffix="만"
                      />
                      <span className="text-xl text-neutral-400 ml-1">원</span>
                    </p>
                    <p className="text-neutral-400 text-sm mb-8">
                      {formatFullCurrency(result.dcEstimate)}
                    </p>

                    {/* 7. Detail rows: StaggerContainer + StaggerItem */}
                    <StaggerContainer stagger={0.06} className="space-y-3 border-t border-neutral-100 pt-6">
                      <StaggerItem>
                        <DetailRow label="계산 방식" value="매월 적립 + 복리 수익" />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow label="월 납입금" value={formatFullCurrency(result.dcContributionMonthly)} />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow label="총 납입금" value={formatFullCurrency(result.totalContributions)} />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow label="투자 수익" value={formatFullCurrency(result.dcEstimate - result.totalContributions)} />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow label="적용 수익률" value={`연 ${returnRate}%`} />
                      </StaggerItem>
                      <StaggerItem>
                        <DetailRow
                          label="월 연금 (10년 수령)"
                          value={formatFullCurrency(result.dcMonthlyPension)}
                          highlight
                        />
                      </StaggerItem>
                    </StaggerContainer>

                    <div className="mt-6 pt-4 border-t border-neutral-100">
                      <p className="text-xs text-neutral-400">
                        운용 수익에 따라 변동. 수익률이 높으면 DB보다 유리할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </SlideIn>
              </div>

              {/* 9. Comparison section with AnimatedProgress */}
              <FadeIn delay={0.5}>
                <div className="bg-neutral-50 rounded-2xl p-5 sm:p-8">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-4 sm:mb-6">비교</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-medium text-neutral-700">DB형</span>
                        <span className="font-semibold tabular-nums">{formatFullCurrency(result.dbEstimate)}</span>
                      </div>
                      <AnimatedProgress
                        value={(result.dbEstimate / maxEstimate) * 100}
                        delay={0.6}
                        duration={0.8}
                        className="h-3 bg-neutral-200 rounded-full overflow-hidden"
                        barClassName="h-full bg-neutral-900 rounded-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-medium text-neutral-700">DC형 (수익률 {returnRate}%)</span>
                        <span className="font-semibold tabular-nums">{formatFullCurrency(result.dcEstimate)}</span>
                      </div>
                      <AnimatedProgress
                        value={(result.dcEstimate / maxEstimate) * 100}
                        delay={0.7}
                        duration={0.8}
                        className="h-3 bg-neutral-200 rounded-full overflow-hidden"
                        barClassName="h-full bg-neutral-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
                    <p className="text-sm text-neutral-600">
                      {result.betterOption === 'DB'
                        ? `DB형이 ${formatMillion(Math.abs(result.difference))}원 유리`
                        : result.betterOption === 'DC'
                          ? `DC형이 ${formatMillion(Math.abs(result.difference))}원 유리`
                          : '두 유형이 비슷합니다'}
                    </p>
                    {/* 10. Recommendation badge: ScaleIn delay 0.8 */}
                    <ScaleIn delay={0.8}>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        result.betterOption === 'DB'
                          ? 'bg-neutral-900 text-white'
                          : result.betterOption === 'DC'
                            ? 'bg-neutral-200 text-neutral-900'
                            : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {result.betterOption === 'SAME' ? '비슷' : `${result.betterOption}형 추천`}
                      </span>
                    </ScaleIn>
                  </div>
                </div>
              </FadeIn>
            </>
          </FadeIn>
        ) : (
          <FadeIn key="empty">
            <div className="py-24 text-center text-neutral-300">
              <p>정보를 입력하세요</p>
            </div>
          </FadeIn>
        )}
      </AnimatePresence>

      <FadeIn delay={0.3}>
        <p className="text-xs text-neutral-400 text-center mt-16">
          참고용 계산 · 실제 수령액은 다를 수 있습니다
        </p>
      </FadeIn>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  light,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  light?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${light ? 'text-neutral-400' : 'text-neutral-400'}`}>
        {label}
      </span>
      <span className={`tabular-nums ${
        highlight
          ? `font-semibold text-lg ${light ? 'text-white' : 'text-neutral-900'}`
          : light ? 'text-neutral-200' : 'text-neutral-700'
      }`}>
        {value}
      </span>
    </div>
  );
}
