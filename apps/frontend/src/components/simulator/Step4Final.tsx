import { useRef } from 'react';
import { useSimulatorStore } from '@/store/simulator.store';
import { formatWon } from '@/utils/calculator';
import { ShareableResult } from './ShareableResult';

const GRADE_CONFIG = {
  S: { label: 'S', color: 'bg-neutral-900 text-white', desc: '완벽한 준비' },
  A: { label: 'A', color: 'bg-neutral-800 text-white', desc: '충분한 준비' },
  B: { label: 'B', color: 'bg-neutral-600 text-white', desc: '적당한 준비' },
  C: { label: 'C', color: 'bg-neutral-400 text-white', desc: '아슬아슬' },
  D: { label: 'D', color: 'bg-neutral-300 text-neutral-700', desc: '위험' },
  F: { label: 'F', color: 'bg-red-100 text-red-600', desc: '매우 위험' },
};

export function Step4Final() {
  const store = useSimulatorStore();
  const r = store.results;
  const shareRef = useRef<HTMLDivElement>(null);

  if (!r) return null;

  const grade = GRADE_CONFIG[r.grade];

  return (
    <div className="space-y-10">
      {/* 핵심 메시지 */}
      <div className="text-center py-8">
        <p className="text-sm text-neutral-400 mb-3">당신은 퇴사 후</p>
        <p className="text-6xl font-black text-neutral-900 tracking-tighter leading-none">
          {r.survivalDays.toLocaleString()}
          <span className="text-3xl font-bold ml-1">일</span>
        </p>
        <p className="text-sm text-neutral-400 mt-3">
          버틸 수 있습니다
        </p>
      </div>

      {/* 등급 */}
      <div className="flex items-center justify-center gap-6">
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black ${grade.color}`}
        >
          {grade.label}
        </div>
        <div>
          <p className="text-sm text-neutral-400">퇴사 준비도</p>
          <p className="text-xl font-bold text-neutral-900">{grade.desc}</p>
          <p className="text-sm text-neutral-500 mt-0.5">
            약 {r.survivalMonths}개월 생존 가능
          </p>
        </div>
      </div>

      {/* 퍼센타일 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <p className="text-xs text-neutral-400 mb-3">같은 연차 직장인 대비</p>
        <div className="flex items-end gap-4">
          <p className="text-4xl font-black text-neutral-900">
            상위 {100 - r.percentile}%
          </p>
        </div>
        <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-700"
            style={{ width: `${r.percentile}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-300">하위</span>
          <span className="text-xs text-neutral-300">상위</span>
        </div>
      </div>

      {/* 상세 요약 */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          상세 요약
        </h3>
        <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
          <SummaryRow label="퇴직금" value={formatWon(r.severancePay)} />
          <SummaryRow
            label="실업급여 총액"
            value={
              r.unemploymentBenefitEligible
                ? formatWon(r.totalBenefit)
                : '수급 불가'
            }
          />
          <SummaryRow label="세금 환급 추정" value={formatWon(r.estimatedTaxRefund)} />
          <SummaryRow
            label="확보 자금 합계"
            value={formatWon(r.totalSavings)}
            bold
          />
          <SummaryRow
            label="월 예상 지출"
            value={formatWon(r.totalMonthlyExpense)}
          />
          {r.additionalFundsNeeded > 0 && (
            <SummaryRow
              label={`${store.restPeriod}개월 쉬려면 추가 필요`}
              value={formatWon(r.additionalFundsNeeded)}
              danger
            />
          )}
        </div>
      </div>

      {/* 공유 이미지 (숨겨진 렌더링) */}
      <ShareableResult ref={shareRef} />

      {/* 하단 버튼 */}
      <div className="space-y-3 pt-4">
        <button
          onClick={() => {
            store.reset();
            store.setCurrentStep(1);
          }}
          className="w-full py-3.5 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          처음부터 다시
        </button>
        <button
          onClick={() => store.setCurrentStep(3)}
          className="w-full py-3 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          시뮬레이션 수정
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  danger,
}: {
  label: string;
  value: string;
  bold?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex justify-between items-center px-5 py-3.5">
      <span className="text-sm text-neutral-500">{label}</span>
      <span
        className={`text-sm ${
          danger
            ? 'text-red-500 font-medium'
            : bold
              ? 'text-neutral-900 font-bold'
              : 'text-neutral-900'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
