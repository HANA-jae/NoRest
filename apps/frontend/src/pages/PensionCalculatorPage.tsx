import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  calculatePension,
  formatMillion,
  formatFullCurrency,
  PensionType,
} from '@/utils/pension-calculator';
import { ROUTES } from '@/router/routes';

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className={`text-sm ${highlight ? 'font-semibold text-neutral-900' : 'text-neutral-900'}`}>
        {value}
      </span>
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

export function PensionCalculatorPage() {
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
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={ROUTES.HOME}
          className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 inline-block"
        >
          ← 홈
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">퇴직연금 계산기</h1>
        <p className="text-sm text-neutral-500 mt-1">
          DB형과 DC형 퇴직연금을 비교합니다.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6 space-y-6">
        {/* Salary & Years */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-600 mb-2">월급 (세전)</label>
            <div className="relative">
              <input
                type="text"
                value={formatInputCurrency(salary)}
                onChange={(e) => setMonthlySalary(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-lg font-semibold bg-neutral-50 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-600 mb-2">예상 근속 기간</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={40}
                value={yearsOfService}
                onChange={(e) => setYearsOfService(parseInt(e.target.value, 10) || 1)}
                className="w-full text-lg font-semibold bg-neutral-50 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">년</span>
            </div>
          </div>
        </div>

        {/* Pension Type */}
        <div>
          <label className="block text-sm text-neutral-600 mb-2">연금 유형</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPensionType('DB')}
              className={`py-3 text-sm rounded-lg border transition-colors ${
                pensionType === 'DB'
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <span className="font-medium">DB형</span>
              <span className="block text-xs opacity-70 mt-0.5">확정급여형</span>
            </button>
            <button
              onClick={() => setPensionType('DC')}
              className={`py-3 text-sm rounded-lg border transition-colors ${
                pensionType === 'DC'
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <span className="font-medium">DC형</span>
              <span className="block text-xs opacity-70 mt-0.5">확정기여형</span>
            </button>
          </div>
        </div>

        {/* Return Rate (DC only) */}
        {pensionType === 'DC' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-neutral-600">예상 연 수익률</label>
              <span className="text-sm font-semibold text-neutral-900">{returnRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-neutral-900 text-white rounded-xl p-6">
            <p className="text-sm text-neutral-400 mb-1">
              {pensionType === 'DB' ? 'DB형' : 'DC형'} 예상 퇴직연금
            </p>
            <p className="text-3xl font-bold">
              {formatMillion(pensionType === 'DB' ? result.dbEstimate : result.dcEstimate)}원
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              월 연금: {formatFullCurrency(pensionType === 'DB' ? result.dbMonthlyPension : result.dcMonthlyPension)}
              <span className="text-neutral-500"> (10년 분할)</span>
            </p>
          </div>

          {/* Comparison */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-neutral-500 mb-4">DB vs DC 비교</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600">DB형 (확정급여형)</span>
                  <span className="font-medium text-neutral-900">{formatFullCurrency(result.dbEstimate)}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-700 rounded-full"
                    style={{ width: `${(result.dbEstimate / Math.max(result.dbEstimate, result.dcEstimate)) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600">DC형 (확정기여형)</span>
                  <span className="font-medium text-neutral-900">{formatFullCurrency(result.dcEstimate)}</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-400 rounded-full"
                    style={{ width: `${(result.dcEstimate / Math.max(result.dbEstimate, result.dcEstimate)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-sm text-neutral-600">
                  {result.difference > 0
                    ? `DB형이 ${formatMillion(result.difference)}원 더 유리합니다.`
                    : result.difference < 0
                      ? `DC형이 ${formatMillion(Math.abs(result.difference))}원 더 유리합니다.`
                      : '두 유형의 예상 금액이 비슷합니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <Section title="상세 정보">
            <ResultRow label="근속 기간" value={`${result.yearsOfService}년`} />
            <ResultRow label="총 납입금" value={formatFullCurrency(result.totalContributions)} />
            <ResultRow label="연금 수령 기간" value={`${result.pensionYears}년`} />
          </Section>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center mt-8">
        계산 결과는 참고용이며 실제 수령액은 회사 규정 및 운용 결과에 따라 달라질 수 있습니다.
      </p>
    </div>
  );
}
