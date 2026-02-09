import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  calculatePension,
  formatMillion,
  formatFullCurrency,
  PensionType,
  PensionResult,
} from '@/utils/pension-calculator';
import { ROUTES } from '@/router/routes';

function PensionTypeCard({
  type,
  selected,
  onClick,
  title,
  description,
}: {
  type: PensionType;
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-brand-500 bg-brand-50'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? 'border-brand-500' : 'border-neutral-300'
          }`}
        >
          {selected && <div className="w-3 h-3 rounded-full bg-brand-500" />}
        </div>
        <div>
          <h3 className={`font-semibold ${selected ? 'text-brand-700' : 'text-neutral-700'}`}>
            {title}
          </h3>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

function ComparisonChart({ result }: { result: PensionResult }) {
  const maxValue = Math.max(result.dbEstimate, result.dcEstimate);
  const dbPercent = (result.dbEstimate / maxValue) * 100;
  const dcPercent = (result.dcEstimate / maxValue) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-neutral-800 mb-6">DB vs DC 비교</h3>

      <div className="space-y-6">
        {/* DB Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-neutral-700">DB형 (확정급여형)</span>
            <span className="font-bold text-neutral-800">{formatMillion(result.dbEstimate)}원</span>
          </div>
          <div className="h-10 bg-neutral-100 rounded-lg overflow-hidden">
            <div
              className={`h-full rounded-lg flex items-center justify-end pr-3 ${
                result.betterOption === 'DB'
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-400 to-blue-500'
              }`}
              style={{ width: `${dbPercent}%` }}
            >
              <span className="text-white text-sm font-medium">
                {formatFullCurrency(result.dbEstimate)}
              </span>
            </div>
          </div>
        </div>

        {/* DC Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-neutral-700">DC형 (확정기여형)</span>
            <span className="font-bold text-neutral-800">{formatMillion(result.dcEstimate)}원</span>
          </div>
          <div className="h-10 bg-neutral-100 rounded-lg overflow-hidden">
            <div
              className={`h-full rounded-lg flex items-center justify-end pr-3 ${
                result.betterOption === 'DC'
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-violet-400 to-violet-500'
              }`}
              style={{ width: `${dcPercent}%` }}
            >
              <span className="text-white text-sm font-medium">
                {formatFullCurrency(result.dcEstimate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Difference */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">차이</span>
          <span
            className={`font-bold ${
              result.difference > 0 ? 'text-blue-600' : result.difference < 0 ? 'text-violet-600' : 'text-neutral-600'
            }`}
          >
            {result.difference > 0 ? 'DB가 ' : result.difference < 0 ? 'DC가 ' : ''}
            {result.difference !== 0 && formatMillion(Math.abs(result.difference)) + '원 유리'}
            {result.difference === 0 && '동일'}
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultSummary({ result }: { result: PensionResult }) {
  const isDB = result.pensionType === 'DB';
  const estimate = isDB ? result.dbEstimate : result.dcEstimate;
  const monthlyPension = isDB ? result.dbMonthlyPension : result.dcMonthlyPension;

  return (
    <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold opacity-90">
          {isDB ? 'DB형' : 'DC형'} 예상 퇴직연금
        </h3>
        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
          {result.yearsOfService}년 근속
        </span>
      </div>

      <div className="text-4xl font-bold mb-2">{formatMillion(estimate)}원</div>
      <p className="text-white/70 text-sm">{formatFullCurrency(estimate)}</p>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
        <div>
          <p className="text-white/70 text-sm">월 연금 수령액</p>
          <p className="text-xl font-bold">{formatMillion(monthlyPension)}원</p>
          <p className="text-xs text-white/50">{result.pensionYears}년 분할 수령 시</p>
        </div>
        <div>
          <p className="text-white/70 text-sm">총 납입금액</p>
          <p className="text-xl font-bold">{formatMillion(result.totalContributions)}원</p>
          <p className="text-xs text-white/50">근속기간 합산</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-neutral-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-neutral-600">{item.label}</span>
            <span className="font-medium text-neutral-800">{item.value}</span>
          </div>
        ))}
      </div>
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
    <div className="max-w-4xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 mb-4"
        >
          ← 홈으로
        </Link>
        <h1 className="text-3xl font-bold text-neutral-800">퇴직연금 계산기</h1>
        <p className="text-neutral-500 mt-2">
          DB형과 DC형 퇴직연금을 비교하고 예상 수령액을 계산합니다.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Salary */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              월급 (세전)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatInputCurrency(salary)}
                onChange={(e) => setMonthlySalary(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-xl font-bold text-neutral-800 bg-neutral-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                원
              </span>
            </div>
          </div>

          {/* Years of Service */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              예상 근속 기간
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={40}
                value={yearsOfService}
                onChange={(e) => setYearsOfService(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xl font-bold text-neutral-800 bg-neutral-50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                년
              </span>
            </div>
          </div>
        </div>

        {/* Pension Type */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            연금 유형 선택
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PensionTypeCard
              type="DB"
              selected={pensionType === 'DB'}
              onClick={() => setPensionType('DB')}
              title="DB형 (확정급여형)"
              description="퇴직 시 평균임금 기준 계산"
            />
            <PensionTypeCard
              type="DC"
              selected={pensionType === 'DC'}
              onClick={() => setPensionType('DC')}
              title="DC형 (확정기여형)"
              description="매년 적립 후 운용 수익 반영"
            />
          </div>
        </div>

        {/* Return Rate (DC only) */}
        {pensionType === 'DC' && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              예상 연 수익률
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold text-brand-600 w-16 text-right">
                {returnRate}%
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              * 수익률은 가정이며, 실제 운용 결과에 따라 달라질 수 있습니다.
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ResultSummary result={result} />
            <ComparisonChart result={result} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InfoCard
              title="DB형 상세"
              items={[
                { label: '예상 퇴직금', value: formatFullCurrency(result.dbEstimate) },
                { label: '월 연금 수령액', value: formatFullCurrency(result.dbMonthlyPension) },
                { label: '계산 방식', value: '평균임금 × 근속연수' },
              ]}
            />
            <InfoCard
              title="DC형 상세"
              items={[
                { label: '예상 적립금', value: formatFullCurrency(result.dcEstimate) },
                { label: '월 연금 수령액', value: formatFullCurrency(result.dcMonthlyPension) },
                { label: '월 납입금', value: formatFullCurrency(result.dcContributionMonthly) },
              ]}
            />
          </div>

          {/* Recommendation */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">선택 가이드</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>
                    <strong>DB형이 유리한 경우:</strong> 임금 상승률이 높을 것으로 예상되는 경우, 장기 근속 예정인 경우
                  </li>
                  <li>
                    <strong>DC형이 유리한 경우:</strong> 투자에 자신 있는 경우, 이직이 잦은 경우, 임금 상승률이 낮은 경우
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center mt-8">
        * 본 계산기는 참고용이며, 실제 퇴직연금 수령액은 회사 규정 및 운용 결과에 따라 달라질 수 있습니다.
      </p>
    </div>
  );
}
