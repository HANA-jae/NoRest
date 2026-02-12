'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calculatePension,
  formatMillion,
  formatFullCurrency,
  PensionType,
} from '@/utils/pension-calculator';

export default function PensionCalculatorPage() {
  const [monthlySalary, setMonthlySalary] = useState<string>('3500000');
  const [yearsOfService, setYearsOfService] = useState<number>(10);
  const [pensionType, setPensionType] = useState<PensionType>('DB');
  const [returnRate, setReturnRate] = useState<number>(3);

  const salary = parseInt(monthlySalary.replace(/,/g, ''), 10) || 0;

  const result = useMemo(() => {
    if (salary <= 0 || yearsOfService <= 0) return null;
    return calculatePension({
      monthlySalary: salary,
      yearsOfService,
      pensionType,
      expectedReturnRate: returnRate,
    });
  }, [salary, yearsOfService, pensionType, returnRate]);

  const formatInputCurrency = (value: number) =>
    new Intl.NumberFormat('ko-KR').format(value);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 mb-12 transition-colors"
      >
        <span>←</span>
        <span>Back</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Left - Input */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
            퇴직연금 계산기
          </h1>
          <p className="text-neutral-500 mb-10">
            DB형과 DC형을 비교하세요
          </p>

          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-2">
                월급
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formatInputCurrency(salary)}
                  onChange={(e) => setMonthlySalary(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-2xl font-bold bg-transparent border-b-2 border-neutral-200 focus:border-neutral-900 pb-3 pr-12 outline-none transition-colors tabular-nums"
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
                  className="w-full text-2xl font-bold bg-transparent border-b-2 border-neutral-200 focus:border-neutral-900 pb-3 pr-12 outline-none transition-colors"
                />
                <span className="absolute right-0 bottom-3 text-lg text-neutral-300">년</span>
              </div>
            </div>

            {/* Pension Type */}
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-3">
                연금 유형
              </label>
              <div className="flex gap-2">
                {(['DB', 'DC'] as PensionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPensionType(type)}
                    className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                      pensionType === type
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    <span className="font-semibold">{type}형</span>
                    <span className="block text-xs mt-0.5 opacity-60">
                      {type === 'DB' ? '확정급여' : '확정기여'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Return Rate */}
            {pensionType === 'DC' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider">
                    예상 수익률
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
                  className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-neutral-900"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right - Results */}
        <div>
          {result ? (
            <div className="space-y-6">
              {/* Main Result */}
              <div className="bg-neutral-900 text-white rounded-2xl p-8">
                <p className="text-sm text-neutral-500 mb-2">
                  {pensionType}형 예상 수령액
                </p>
                <p className="text-5xl font-bold tracking-tight tabular-nums">
                  {formatMillion(pensionType === 'DB' ? result.dbEstimate : result.dcEstimate)}
                  <span className="text-2xl text-neutral-500 ml-1">원</span>
                </p>
                <p className="text-neutral-500 mt-4">
                  월 {formatFullCurrency(pensionType === 'DB' ? result.dbMonthlyPension : result.dcMonthlyPension)}
                  <span className="text-neutral-600"> · 10년 분할</span>
                </p>
              </div>

              {/* Comparison */}
              <div className="border border-neutral-200 rounded-2xl p-6">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-6">
                  DB vs DC
                </p>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-neutral-600">DB형</span>
                      <span className="font-semibold tabular-nums">{formatFullCurrency(result.dbEstimate)}</span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                        style={{ width: `${(result.dbEstimate / Math.max(result.dbEstimate, result.dcEstimate)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-neutral-600">DC형</span>
                      <span className="font-semibold tabular-nums">{formatFullCurrency(result.dcEstimate)}</span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-400 rounded-full transition-all duration-500"
                        style={{ width: `${(result.dcEstimate / Math.max(result.dbEstimate, result.dcEstimate)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-500 mt-6 pt-6 border-t border-neutral-100">
                  {result.difference > 0
                    ? `DB형이 ${formatMillion(result.difference)}원 유리`
                    : result.difference < 0
                      ? `DC형이 ${formatMillion(Math.abs(result.difference))}원 유리`
                      : '두 유형이 비슷합니다'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold tabular-nums">{yearsOfService}</p>
                  <p className="text-xs text-neutral-500 mt-1">근속연수</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold tabular-nums">{result.pensionYears}</p>
                  <p className="text-xs text-neutral-500 mt-1">수령기간</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold tabular-nums">{formatMillion(result.totalContributions)}</p>
                  <p className="text-xs text-neutral-500 mt-1">총 납입</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-300">
              <p>정보를 입력하세요</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-400 text-center mt-16">
        참고용 계산 · 실제 수령액은 다를 수 있습니다
      </p>
    </div>
  );
}
