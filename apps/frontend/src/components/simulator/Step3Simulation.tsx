import { useSimulatorStore } from '@/store/simulator.store';
import { formatWon } from '@/utils/calculator';

const PERIOD_OPTIONS = [
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '1년' },
];

export function Step3Simulation() {
  const store = useSimulatorStore();
  const r = store.results;

  if (!r) return null;

  const totalExpense = store.rent + store.living + store.insurance + store.other + r.totalInsuranceMonthly;
  const periodExpense = totalExpense * store.restPeriod;
  const diff = r.totalSavings - periodExpense;

  return (
    <div className="space-y-8">
      {/* 쉬는 기간 선택 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          쉬고 싶은 기간
        </label>
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => store.setStep3({ restPeriod: opt.value })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-all ${
                store.restPeriod === opt.value
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 월별 지출 입력 */}
      <div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
          월 예상 지출
        </h2>
        <div className="space-y-3">
          {[
            { key: 'rent' as const, label: '주거비 (월세/대출이자)', placeholder: '500000' },
            { key: 'living' as const, label: '생활비 (식비/교통/통신)', placeholder: '800000' },
            { key: 'insurance' as const, label: '기타 보험료', placeholder: '0' },
            { key: 'other' as const, label: '기타 지출', placeholder: '200000' },
          ].map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <label className="w-40 text-sm text-neutral-600 shrink-0">
                {field.label}
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={Number(field.placeholder).toLocaleString('ko-KR')}
                  value={store[field.key] ? store[field.key].toLocaleString('ko-KR') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    store.setStep3({ [field.key]: Number(raw) || 0 });
                  }}
                  className="w-full px-3 py-2.5 pr-10 border border-neutral-200 rounded-lg text-sm text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  원
                </span>
              </div>
            </div>
          ))}

          {/* 자동 추가: 보험 */}
          <div className="flex items-center gap-3 opacity-60">
            <label className="w-40 text-sm text-neutral-500 shrink-0">
              4대보험 (자동계산)
            </label>
            <div className="flex-1 px-3 py-2.5 border border-dashed border-neutral-200 rounded-lg text-sm text-neutral-500 bg-neutral-50">
              {formatWon(r.totalInsuranceMonthly)}
            </div>
          </div>
        </div>
      </div>

      {/* 시뮬레이션 결과 */}
      <div className="border-t border-neutral-200 pt-6">
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-sm text-neutral-500">월 총 지출</span>
          <span className="text-xl font-bold text-neutral-900">
            {formatWon(totalExpense)}
          </span>
        </div>

        {/* 비교 바 */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>확보 자금</span>
              <span>{formatWon(r.totalSavings)}</span>
            </div>
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (r.totalSavings / Math.max(periodExpense, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>{store.restPeriod}개월 총 지출</span>
              <span>{formatWon(periodExpense)}</span>
            </div>
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-400 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* 차이 */}
        <div
          className={`mt-6 p-5 rounded-lg text-center ${
            diff >= 0
              ? 'bg-neutral-900 text-white'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {diff >= 0 ? (
            <>
              <p className="text-xs text-neutral-400 mb-1">
                {store.restPeriod}개월 쉬어도
              </p>
              <p className="text-2xl font-bold">{formatWon(diff)} 남음</p>
            </>
          ) : (
            <>
              <p className="text-xs text-red-400 mb-1">
                {store.restPeriod}개월 쉬려면
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatWon(Math.abs(diff))} 부족
              </p>
            </>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => store.setCurrentStep(2)}
          className="flex-1 py-3.5 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          이전
        </button>
        <button
          onClick={() => {
            store.runCalculation();
            store.setCurrentStep(4);
          }}
          className="flex-[2] py-3.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          최종 결과 보기
        </button>
      </div>
    </div>
  );
}
