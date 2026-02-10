'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateSalary, formatCurrency, formatCurrencyWon } from '@/utils/salary-calculator';

type InputMode = 'annual' | 'monthly';

export default function SalaryCalculatorPage() {
  const [inputMode, setInputMode] = useState<InputMode>('annual');
  const [salaryInput, setSalaryInput] = useState<string>('50000000');

  const salary = parseInt(salaryInput.replace(/,/g, ''), 10) || 0;

  const result = useMemo(() => {
    if (salary <= 0) return null;
    return calculateSalary(
      inputMode === 'annual' ? { annualSalary: salary } : { monthlySalary: salary }
    );
  }, [salary, inputMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSalaryInput(value);
  };

  const netRatio = result ? ((result.netMonthlySalary / result.monthlySalary) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
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
            연봉 계산기
          </h1>
          <p className="text-neutral-500 mb-10">
            4대보험과 세금을 제외한 실수령액
          </p>

          {/* Toggle */}
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-full w-fit mb-6">
            <button
              onClick={() => setInputMode('annual')}
              className={`px-5 py-2 text-sm rounded-full transition-all ${
                inputMode === 'annual'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              연봉
            </button>
            <button
              onClick={() => setInputMode('monthly')}
              className={`px-5 py-2 text-sm rounded-full transition-all ${
                inputMode === 'monthly'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              월급
            </button>
          </div>

          {/* Input */}
          <div className="relative">
            <input
              type="text"
              value={formatCurrency(salary)}
              onChange={handleInputChange}
              className="w-full text-4xl font-bold text-neutral-900 bg-transparent border-b-2 border-neutral-200 focus:border-neutral-900 pb-4 pr-12 outline-none transition-colors tabular-nums"
            />
            <span className="absolute right-0 bottom-4 text-2xl text-neutral-300">원</span>
          </div>

          {salary > 0 && (
            <p className="text-sm text-neutral-400 mt-4">
              {inputMode === 'annual'
                ? `월 ${formatCurrencyWon(salary / 12)}`
                : `연 ${formatCurrencyWon(salary * 12)}`}
            </p>
          )}
        </div>

        {/* Right - Results */}
        <div>
          {result ? (
            <div className="space-y-8">
              {/* Main Result */}
              <div className="bg-neutral-900 text-white rounded-2xl p-8">
                <p className="text-sm text-neutral-500 mb-2">월 실수령액</p>
                <p className="text-5xl font-bold tracking-tight tabular-nums">
                  {formatCurrency(result.netMonthlySalary)}
                  <span className="text-2xl text-neutral-500 ml-1">원</span>
                </p>
                <div className="mt-6 pt-6 border-t border-neutral-800 flex gap-6">
                  <div>
                    <p className="text-xs text-neutral-500">연간</p>
                    <p className="text-lg font-medium tabular-nums">
                      {formatCurrency(result.netAnnualSalary)}원
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">실수령률</p>
                    <p className="text-lg font-medium">{netRatio}%</p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-1">
                <Row label="세전 월급" value={result.monthlySalary} />
                <Row label="국민연금" value={-result.nationalPension} sub="4.5%" />
                <Row label="건강보험" value={-result.healthInsurance} sub="3.545%" />
                <Row label="장기요양" value={-result.longTermCare} />
                <Row label="고용보험" value={-result.employmentInsurance} sub="0.9%" />
                <Row label="소득세" value={-result.incomeTax} />
                <Row label="지방소득세" value={-result.localIncomeTax} />
                <div className="pt-4 mt-4 border-t border-neutral-200">
                  <Row label="실수령액" value={result.netMonthlySalary} highlight />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-300">
              <p>금액을 입력하세요</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-neutral-400 text-center mt-16">
        2024년 기준 · 실제 금액과 다를 수 있습니다
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  highlight
}: {
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  const isNegative = value < 0;
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-neutral-500">
        {label}
        {sub && <span className="text-neutral-300 ml-2">{sub}</span>}
      </span>
      <span className={`tabular-nums ${highlight ? 'text-lg font-semibold text-neutral-900' : isNegative ? 'text-neutral-400' : 'text-neutral-900'}`}>
        {isNegative ? '-' : ''}{formatCurrencyWon(Math.abs(value))}
      </span>
    </div>
  );
}
