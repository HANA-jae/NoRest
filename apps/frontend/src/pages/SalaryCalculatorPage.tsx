import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calculateSalary, formatCurrency, formatCurrencyWon, SalaryResult } from '@/utils/salary-calculator';
import { ROUTES } from '@/router/routes';

type InputMode = 'annual' | 'monthly';

function ResultRow({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-neutral-600">{label}</span>
      <div className="text-right">
        <span className={`text-sm ${highlight ? 'font-semibold text-neutral-900' : 'text-neutral-900'}`}>
          {value}
        </span>
        {sub && <span className="text-xs text-neutral-400 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <h3 className="text-sm font-medium text-neutral-500 mb-4">{title}</h3>
      <div className="divide-y divide-neutral-100">{children}</div>
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

  const netRatio = result ? ((result.netMonthlySalary / result.monthlySalary) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={ROUTES.HOME}
          className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 inline-block"
        >
          ← 홈
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">연봉 계산기</h1>
        <p className="text-sm text-neutral-500 mt-1">
          4대보험과 세금을 제외한 실수령액을 계산합니다.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('annual')}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
              inputMode === 'annual'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            연봉
          </button>
          <button
            onClick={() => setInputMode('monthly')}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
              inputMode === 'monthly'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            월급
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={formatCurrency(salary)}
            onChange={handleInputChange}
            placeholder="금액을 입력하세요"
            className="w-full text-2xl font-semibold text-neutral-900 bg-neutral-50 rounded-lg px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            원
          </span>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-neutral-900 text-white rounded-xl p-6">
            <p className="text-sm text-neutral-400 mb-1">월 실수령액</p>
            <p className="text-3xl font-bold">{formatCurrencyWon(result.netMonthlySalary)}</p>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-neutral-400">
                연 {formatCurrency(result.netAnnualSalary)}원
              </span>
              <span className="text-neutral-400">
                실수령률 {netRatio}%
              </span>
            </div>
          </div>

          {/* Insurance */}
          <Section title="4대보험 (월)">
            <ResultRow label="국민연금" value={formatCurrencyWon(result.nationalPension)} sub="4.5%" />
            <ResultRow label="건강보험" value={formatCurrencyWon(result.healthInsurance)} sub="3.545%" />
            <ResultRow label="장기요양보험" value={formatCurrencyWon(result.longTermCare)} />
            <ResultRow label="고용보험" value={formatCurrencyWon(result.employmentInsurance)} sub="0.9%" />
            <ResultRow label="합계" value={formatCurrencyWon(result.totalInsurance)} highlight />
          </Section>

          {/* Tax */}
          <Section title="세금 (월)">
            <ResultRow label="소득세" value={formatCurrencyWon(result.incomeTax)} />
            <ResultRow label="지방소득세" value={formatCurrencyWon(result.localIncomeTax)} sub="소득세의 10%" />
            <ResultRow label="합계" value={formatCurrencyWon(result.totalTax)} highlight />
          </Section>

          {/* Total */}
          <Section title="요약">
            <ResultRow label="세전 월급" value={formatCurrencyWon(result.monthlySalary)} />
            <ResultRow label="총 공제액" value={`-${formatCurrencyWon(result.totalDeduction)}`} />
            <ResultRow label="실수령액" value={formatCurrencyWon(result.netMonthlySalary)} highlight />
          </Section>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center mt-8">
        2024년 기준 간이세액표를 참고하여 계산되었습니다. 실제 금액과 다를 수 있습니다.
      </p>
    </div>
  );
}
