import { useSimulatorStore } from '@/store/simulator.store';

const STEPS = [
  { num: 1, label: '기본 정보' },
  { num: 2, label: '계산 결과' },
  { num: 3, label: '시뮬레이션' },
  { num: 4, label: '최종 결과' },
];

export function StepIndicator() {
  const currentStep = useSimulatorStore((s) => s.currentStep);

  return (
    <div className="flex items-center justify-between max-w-md mx-auto mb-12">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step.num === currentStep
                  ? 'bg-neutral-900 text-white scale-110'
                  : step.num < currentStep
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-200 text-neutral-400'
              }`}
            >
              {step.num < currentStep ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`mt-2 text-xs tracking-tight ${
                step.num === currentStep
                  ? 'text-neutral-900 font-medium'
                  : step.num < currentStep
                    ? 'text-neutral-500'
                    : 'text-neutral-300'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-px mx-2 mt-[-18px] transition-colors duration-300 ${
                step.num < currentStep ? 'bg-neutral-700' : 'bg-neutral-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
