import { forwardRef, useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { useSimulatorStore } from '@/store/simulator.store';
import { formatWon } from '@/utils/calculator';

const GRADE_BG: Record<string, string> = {
  S: '#1a1a1a',
  A: '#292929',
  B: '#525252',
  C: '#737373',
  D: '#a3a3a3',
  F: '#ef4444',
};

export const ShareableResult = forwardRef<HTMLDivElement>(function ShareableResult(_, ref) {
  const r = useSimulatorStore((s) => s.results);
  const [saving, setSaving] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = document.getElementById('shareable-card');
    if (!el) return;

    setSaving(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#fafafa',
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `퇴사시뮬레이터_결과.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setSaving(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    const el = document.getElementById('shareable-card');
    if (!el) return;

    setSaving(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#fafafa',
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          alert('클립보드에 복사되었습니다');
        } catch {
          // 클립보드 API 미지원 시 다운로드로 대체
          handleDownload();
        }
      });
    } finally {
      setSaving(false);
    }
  }, [handleDownload]);

  if (!r) return null;

  return (
    <div ref={ref}>
      {/* 공유용 카드 (캡처 대상) */}
      <div
        id="shareable-card"
        style={{
          width: 400,
          padding: 40,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: '#fafafa',
          position: 'absolute',
          left: '-9999px',
          top: 0,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>
            퇴사 시뮬레이터
          </p>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
            퇴사 후 버틸 수 있는 기간
          </p>
          <p
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: '#1a1a1a',
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            {r.survivalDays.toLocaleString()}
            <span style={{ fontSize: 24, fontWeight: 700, marginLeft: 4 }}>일</span>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#fff',
              background: GRADE_BG[r.grade] || '#1a1a1a',
            }}
          >
            {r.grade}
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#999' }}>퇴사 준비도</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
              상위 {100 - r.percentile}%
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #e5e5e5',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: 11, color: '#999' }}>확보 자금</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
              {formatWon(r.totalSavings)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: '#999' }}>월 지출</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
              {formatWon(r.totalMonthlyExpense)}
            </p>
          </div>
        </div>

        <p
          style={{
            marginTop: 24,
            fontSize: 10,
            color: '#ccc',
            textAlign: 'center',
          }}
        >
          퇴사 시뮬레이터 | 참고용 계산이며 실제와 다를 수 있습니다
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={saving}
          className="flex-1 py-3.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {saving ? '생성 중...' : '이미지 저장'}
        </button>
        <button
          onClick={handleCopy}
          disabled={saving}
          className="flex-1 py-3.5 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-50"
        >
          클립보드 복사
        </button>
      </div>
    </div>
  );
});
