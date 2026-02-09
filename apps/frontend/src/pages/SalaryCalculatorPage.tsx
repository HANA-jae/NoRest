import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calculateSalary, formatCurrency, formatCurrencyWon, SalaryResult } from '@/utils/salary-calculator';
import { ROUTES } from '@/router/routes';

type InputMode = 'annual' | 'monthly';

function ResultCard({
  label,
  value,
  subValue,
  accent = false,
  negative = false,
}: {
  label: string;
  value: string;
  subValue?: string;
  accent?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl ${
        accent
          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
          : 'bg-neutral-50'
      }`}
    >
      <p className={`text-sm ${accent ? 'text-white/80' : 'text-neutral-500'} mb-1`}>
        {label}
      </p>
      <p
        className={`text-xl font-bold ${
          accent ? 'text-white' : negative ? 'text-danger-600' : 'text-neutral-800'
        }`}
      >
        {negative && '-'}{value}
      </p>
      {subValue && (
        <p className={`text-xs mt-1 ${accent ? 'text-white/70' : 'text-neutral-400'}`}>
          {subValue}
        </p>
      )}
    </div>
  );
}

function InsuranceBreakdown({ result }: { result: SalaryResult }) {
  const items = [
    { label: '국민연금', value: result.nationalPension, rate: '4.5%' },
    { label: '건강보험', value: result.healthInsurance, rate: '3.545%' },
    { label: '장기요양보험', value: result.longTermCare, rate: '건보료의 12.95%' },
    { label: '고용보험', value: result.employmentInsurance, rate: '0.9%' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-neutral-800 mb-4">4대보험 상세 (월)</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <span className="text-neutral-700">{item.label}</span>
              <span className="text-xs text-neutral-400 ml-2">{item.rate}</span>
            </div>
            <span className="font-medium text-neutral-800">
              {formatCurrencyWon(item.value)}
            </span>
          </div>
        ))}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
          <span className="font-medium text-neutral-800">합계</span>
          <span className="font-bold text-brand-600">
            {formatCurrencyWon(result.totalInsurance)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TaxBreakdown({ result }: { result: SalaryResult }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-neutral-800 mb-4">세금 상세 (월)</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-700">소득세</span>
          <span className="font-medium text-neutral-800">
            {formatCurrencyWon(result.incomeTax)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-neutral-700">지방소득세</span>
            <span className="text-xs text-neutral-400 ml-2">소득세의 10%</span>
          </div>
          <span className="font-medium text-neutral-800">
            {formatCurrencyWon(result.localIncomeTax)}
          </span>
        </div>
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
          <span className="font-medium text-neutral-800">합계</span>
          <span className="font-bold text-danger-600">
            {formatCurrencyWon(result.totalTax)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ gross, net }: { gross: number; net: number }) {
  const netPercent = (net / gross) * 100;
  const deductPercent = 100 - netPercent;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-neutral-800 mb-4">급여 구성</h3>
      <div className="h-8 rounded-full overflow-hidden flex">
        <div
          className="bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-medium"
          style={{ width: `${netPercent}%` }}
        >
          {netPercent.toFixed(1)}%
        </div>
        <div
          className="bg-neutral-300 flex items-center justify-center text-neutral-600 text-sm font-medium"
          style={{ width: `${deductPercent}%` }}
        >
          {deductPercent.toFixed(1)}%
        </div>
      </div>
      <div className="flex justify-between mt-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-500" />
          <span className="text-neutral-600">실수령액</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
          <span className="text-neutral-600">공제액</span>
        </div>
      </div>
    </div>
  );
}

export function SalaryCalculatorPage() {
  const [inputMode, setInputMode] = useState<InputMode>('annual');
  const [salaryInput, setSalaryInput] = useState<string>('50000000');

  const salary = parseInt(salaryInput.replace(/,/g, ''), 10) || 0;

  const result = useMemo(() => {
    if (salary <= 0) return null;
    return calculateSalary(
      inputMode === 'annual'
        ? { annualSalary: salary }
        : { monthlySalary: salary }
    );
  }, [salary, inputMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSalaryInput(value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 mb-4"
        >
          ← 홈으로
        </Link>
        <h1 className="text-3xl font-bold text-neutral-800">연봉 계산기</h1>
        <p className="text-neutral-500 mt-2">
          연봉 또는 월급을 입력하면 4대보험과 세금을 제외한 실수령액을 계산합니다.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('annual')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'annual'
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            연봉 입력
          </button>
          <button
            onClick={() => setInputMode('monthly')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'monthly'
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            월급 입력
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={formatCurrency(salary)}
            onChange={handleInputChange}
            placeholder={inputMode === 'annual' ? '연봉을 입력하세요' : '월급을 입력하세요'}
            className="w-full text-3xl font-bold text-neutral-800 bg-neutral-50 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-neutral-400">
            원
          </span>
        </div>

        {salary > 0 && (
          <p className="text-sm text-neutral-500 mt-2">
            {inputMode === 'annual'
              ? `월 ${formatCurrencyWon(salary / 12)}`
              : `연 ${formatCurrencyWon(salary * 12)}`}
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ResultCard
              label="월 실수령액"
              value={formatCurrencyWon(result.netMonthlySalary)}
              subValue={`연 ${formatCurrencyWon(result.netAnnualSalary)}`}
              accent
            />
            <ResultCard
              label="월 공제액"
              value={formatCurrencyWon(result.totalDeduction)}
              subValue={`연 ${formatCurrencyWon(result.annualDeduction)}`}
              negative
            />
            <ResultCard
              label="실수령 비율"
              value={`${((result.netMonthlySalary / result.monthlySalary) * 100).toFixed(1)}%`}
              subValue="세전 대비"
            />
          </div>

          {/* Comparison Bar */}
          <div className="mb-6">
            <ComparisonBar gross={result.monthlySalary} net={result.netMonthlySalary} />
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InsuranceBreakdown result={result} />
            <TaxBreakdown result={result} />
          </div>

          {/* Annual Summary */}
          <div className="bg-neutral-800 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">연간 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(result.annualSalary)}</p>
                <p className="text-sm text-neutral-400">연봉</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-400">
                  {formatCurrency(result.netAnnualSalary)}
                </p>
                <p className="text-sm text-neutral-400">실수령액</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(result.annualInsurance)}
                </p>
                <p className="text-sm text-neutral-400">4대보험</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(result.annualTax)}
                </p>
                <p className="text-sm text-neutral-400">세금</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center mt-8">
        * 본 계산기는 2024년 기준 간이세액표를 참고하여 만들어졌으며, 실제 급여와 다를 수 있습니다.
        <br />
        정확한 금액은 회사 급여명세서 또는 국세청 간이세액표를 확인해주세요.
      </p>
    </div>
  );
}
