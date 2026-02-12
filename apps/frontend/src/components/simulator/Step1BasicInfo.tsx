import { useEffect, useState } from 'react';
import { useSimulatorStore } from '@/store/simulator.store';
import { useStore } from 'zustand';

export function Step1BasicInfo() {
  const store = useSimulatorStore();
  const [annualSalary, setAnnualSalary] = useState<number>(store.monthlySalary > 0 ? store.monthlySalary * 12 : 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!store.startDate) newErrors.startDate = '입사일을 입력하세요';
    if (!store.monthlySalary || store.monthlySalary <= 0)
      newErrors.monthlySalary = '연봉을 입력하세요';
    if (!store.age || store.age < 18 || store.age > 70)
      newErrors.age = '나이를 입력하세요 (18~70)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    store.runCalculation();
    store.setCurrentStep(2);
  };

  const monthRange = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  useEffect(() => {
    if(store.insuranceMonths < 12) {
      store.setStep1({ hasSeverancePay: false });
    } else {
      store.setStep1({ hasSeverancePay: true });
    }
  }, [store.insuranceMonths]);

  return (
    <div className="space-y-8">
      {/* 입사일 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          입사일
        </label>
        <input
          type="date"
          max="9999-12-31"
          value={store.startDate}
          onChange={(e) => {
              store.setStep1({ startDate: e.target.value, insuranceMonths: monthRange(e.target.value, store.endDate) || 0})
            }
          }
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
        {errors.startDate && (
          <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
        )}
      </div>
      {/* 퇴사(예정)일 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          퇴사(예정)일
        </label>
        <input
          type="date"
          max="9999-12-31"
          value={store.endDate}
          onChange={(e) => {
              store.setStep1({ endDate: e.target.value, insuranceMonths: monthRange(store.startDate, e.target.value) || 0})
            }
          }
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
        {errors.endDate && (
          <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
        )}
      </div>
      {/* 연봉 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          연봉 (세전)
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="24,000,000"
            value={annualSalary ? annualSalary.toLocaleString('ko-KR') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, '');
              const annual = Number(raw) || 0;
              setAnnualSalary(annual);
              store.setStep1({ monthlySalary: Math.round(annual / 12) });
            }}
            className="w-full px-4 py-3 pr-12 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
            원
          </span>
        </div>
        {errors.monthlySalary && (
          <p className="mt-1 text-xs text-red-500">{errors.monthlySalary}</p>
        )}
        {annualSalary > 0 && (
          <p className="mt-1 text-xs text-neutral-400">
            월급 약 {Math.round(annualSalary / 12).toLocaleString('ko-KR')}원
          </p>
        )}
      </div>

      {/* 나이 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          만 나이
        </label>
        <input
          type="number"
          placeholder="30"
          value={store.age || ''}
          onChange={(e) => store.setStep1({ age: Number(e.target.value) })}
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
        {errors.age && (
          <p className="mt-1 text-xs text-red-500">{errors.age}</p>
        )}
      </div>

      {/* 고용보험 가입 기간 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          고용보험 가입 기간
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="24"
            value={store.insuranceMonths || ''}
            onChange={(e) => {
                store.setStep1({ insuranceMonths: Number(e.target.value), hasSeverancePay: Number(e.target.value) < 12 ? false : true });
              }
            }
            className="w-full px-4 py-3 pr-12 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
            개월
          </span>
        </div>
      </div>

      {/* 퇴직금 적용 여부 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          퇴직금 적용 여부
        </label>
        <div className="flex gap-3">
          {[
            { value: true, label: '적용' },
            { value: false, label: '미적용' },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => store.setStep1({ hasSeverancePay: opt.value })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium border transition-all ${
                store.hasSeverancePay === opt.value
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-neutral-400">
          1년 이상 근무 시 퇴직금 지급 대상
        </p>
      </div>

      {/* 퇴사 유형 */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          퇴사 유형
        </label>
        <div className="flex gap-3">
          {[
            { value: 'involuntary' as const, label: '권고사직 / 해고', desc: '실업급여 수급 가능' },
            { value: 'voluntary' as const, label: '자발적 퇴사', desc: '실업급여 수급 불가' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => store.setStep1({ resignationType: opt.value })}
              className={`flex-1 py-3 px-4 rounded-lg text-left border transition-all ${
                store.resignationType === opt.value
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400'
              }`}
            >
              <span className="block text-sm font-medium">{opt.label}</span>
              <span
                className={`block text-xs mt-0.5 ${
                  store.resignationType === opt.value
                    ? 'text-neutral-300'
                    : 'text-neutral-400'
                }`}
              >
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        className="w-full py-4 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-neutral-800 active:bg-neutral-700 transition-colors mt-4"
      >
        계산하기
      </button>
    </div>
  );
}
