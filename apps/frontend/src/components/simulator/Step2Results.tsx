import { useSimulatorStore } from '@/store/simulator.store';
import { formatWon } from '@/utils/calculator';

function ResultCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-lg border ${
        accent
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white'
      }`}
    >
      <p
        className={`text-xs uppercase tracking-wider mb-1 ${
          accent ? 'text-neutral-400' : 'text-neutral-400'
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold tracking-tight ${
          accent ? 'text-white' : 'text-neutral-900'
        }`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-xs mt-1.5 ${
            accent ? 'text-neutral-400' : 'text-neutral-400'
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function Step2Results() {
  const store = useSimulatorStore();
  const r = store.results;

  if (!r) return null;

  return (
    <div className="space-y-8">
      {/* 근속 정보 */}
      <div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
          근속 정보
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <ResultCard
            label="근속일수"
            value={`${r.workingDays.toLocaleString()}일`}
          />
          <ResultCard
            label="근속연수"
            value={`${r.workingYears}년`}
            sub={`약 ${r.workingMonths}개월`}
          />
          <ResultCard
            label="1일 평균임금"
            value={formatWon(Math.floor(r.dailyAvgWage))}
          />
        </div>
      </div>

      {/* 퇴직금 */}
      <div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
          퇴직금
        </h2>
        <ResultCard
          accent
          label="예상 퇴직금"
          value={formatWon(r.severancePay)}
          sub={
            r.severancePay === 0
              ? '1년 미만 근무 또는 퇴직금 미적용'
              : `1일 평균임금 ${formatWon(Math.floor(r.dailyAvgWage))} × 30 × ${r.workingYears}년`
          }
        />
      </div>

      {/* 실업급여 */}
      <div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
          실업급여
        </h2>
        {r.unemploymentBenefitEligible ? (
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              accent
              label="총 수령액"
              value={formatWon(r.totalBenefit)}
              sub={`${r.benefitDays}일간 수급`}
            />
            <ResultCard
              label="1일 수령액"
              value={formatWon(r.dailyBenefit)}
              sub={`월 약 ${formatWon(r.dailyBenefit * 30)}`}
            />
          </div>
        ) : (
          <div className="p-5 rounded-lg border border-neutral-200 bg-white">
            <p className="text-sm text-neutral-500">
              {store.resignationType === 'voluntary'
                ? '자발적 퇴사는 실업급여 수급 대상이 아닙니다'
                : '고용보험 가입기간 6개월 미만은 수급 대상이 아닙니다'}
            </p>
          </div>
        )}
      </div>

      {/* 보험 + 세금 */}
      <div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
          퇴사 후 부담
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            label="국민연금 (월)"
            value={formatWon(r.nationalPensionMonthly)}
            sub="지역가입자 전환 시"
          />
          <ResultCard
            label="건강보험 (월)"
            value={formatWon(r.healthInsuranceMonthly)}
            sub="임의계속가입 기준"
          />
        </div>
      </div>

      {/* 세금 환급 */}
      <div>
        <ResultCard
          label="세금 환급 추정"
          value={formatWon(r.estimatedTaxRefund)}
          sub="연말정산 미완료분 기준 추정치"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => store.setCurrentStep(1)}
          className="flex-1 py-3.5 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          다시 입력
        </button>
        <button
          onClick={() => store.setCurrentStep(3)}
          className="flex-[2] py-3.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          시뮬레이션 해보기
        </button>
      </div>
    </div>
  );
}
