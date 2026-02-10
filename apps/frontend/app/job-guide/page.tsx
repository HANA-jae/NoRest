'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useConfirm } from '@/store/confirm.store';

interface ChecklistItem {
  id: string;
  text: string;
}

interface Phase {
  id: string;
  num: string;
  title: string;
  items: ChecklistItem[];
}

const phases: Phase[] = [
  {
    id: 'preparation',
    num: '01',
    title: '준비',
    items: [
      { id: 'p1', text: '이직 목표 정리 (연봉/성장/워라밸)' },
      { id: 'p2', text: '시장 가치 파악' },
      { id: 'p3', text: '비상금 확보 (3개월 이상)' },
      { id: 'p4', text: '타이밍 검토 (성과급/스톡옵션)' },
    ],
  },
  {
    id: 'resume',
    num: '02',
    title: '이력서',
    items: [
      { id: 'r1', text: '이력서 최신화' },
      { id: 'r2', text: '성과 정량화' },
      { id: 'r3', text: '포트폴리오 정리' },
      { id: 'r4', text: 'LinkedIn 업데이트' },
    ],
  },
  {
    id: 'search',
    num: '03',
    title: '탐색',
    items: [
      { id: 's1', text: '목표 회사 리스트 (10개+)' },
      { id: 's2', text: '회사 리뷰 조사' },
      { id: 's3', text: '네트워크 활용' },
      { id: 's4', text: '헤드헌터 컨택' },
    ],
  },
  {
    id: 'interview',
    num: '04',
    title: '면접',
    items: [
      { id: 'i1', text: '예상 질문 준비' },
      { id: 'i2', text: '기술 면접 대비' },
      { id: 'i3', text: '역질문 준비' },
      { id: 'i4', text: '감사 메일 발송' },
    ],
  },
  {
    id: 'negotiation',
    num: '05',
    title: '협상',
    items: [
      { id: 'n1', text: '연봉 협상' },
      { id: 'n2', text: '복리후생 확인' },
      { id: 'n3', text: '계약서 검토' },
      { id: 'n4', text: '입사일 협의' },
    ],
  },
  {
    id: 'resignation',
    num: '06',
    title: '퇴사',
    items: [
      { id: 'd1', text: '퇴사 의사 전달' },
      { id: 'd2', text: '인수인계' },
      { id: 'd3', text: '퇴직금/4대보험 확인' },
      { id: 'd4', text: '동료 인사' },
    ],
  },
];

const STORAGE_KEY = 'han-job-guide-progress';

function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return new Set(JSON.parse(saved));
  } catch {}
  return new Set();
}

function saveProgress(items: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
}

export default function JobGuidePage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => loadProgress());
  const [activePhase, setActivePhase] = useState<string>('preparation');
  const { confirm } = useConfirm();

  const handleCheck = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      saveProgress(next);
      return next;
    });
  };

  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const totalProgress = (checkedItems.size / totalItems) * 100;

  const handleReset = async () => {
    const confirmed = await confirm({
      title: '진행 상황 초기화',
      message: '모든 체크리스트를 초기화하시겠습니까?',
      confirmText: '초기화',
      variant: 'danger',
    });
    if (confirmed) {
      setCheckedItems(new Set());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const currentPhase = phases.find((p) => p.id === activePhase) || phases[0];
  const phaseProgress = (currentPhase.items.filter((i) => checkedItems.has(i.id)).length / currentPhase.items.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 mb-12 transition-colors"
      >
        <span>←</span>
        <span>Back</span>
      </Link>

      <div className="flex items-start justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
            이직 가이드
          </h1>
          <p className="text-neutral-500">
            단계별 체크리스트로 관리하세요
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-neutral-400 hover:text-neutral-900"
        >
          초기화
        </button>
      </div>

      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Progress</span>
          <span className="text-4xl font-bold tabular-nums">{Math.round(totalProgress)}%</span>
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-12">
        {/* Phase Nav */}
        <nav className="space-y-1">
          {phases.map((phase) => {
            const done = phase.items.filter((i) => checkedItems.has(i.id)).length;
            const total = phase.items.length;
            const isComplete = done === total;

            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activePhase === phase.id
                    ? 'bg-neutral-900 text-white'
                    : 'hover:bg-neutral-100'
                }`}
              >
                <span className={`text-xs tabular-nums ${activePhase === phase.id ? 'text-neutral-500' : 'text-neutral-300'}`}>
                  {phase.num}
                </span>
                <span className="flex-1 font-medium">{phase.title}</span>
                {isComplete ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <span className={`text-xs ${activePhase === phase.id ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {done}/{total}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Checklist */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              {currentPhase.title}
            </h2>
            <span className="text-sm text-neutral-400 tabular-nums">
              {Math.round(phaseProgress)}%
            </span>
          </div>

          <div className="space-y-2">
            {currentPhase.items.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  checkedItems.has(item.id)
                    ? 'bg-neutral-100'
                    : 'bg-white border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    checkedItems.has(item.id)
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300'
                  }`}
                >
                  {checkedItems.has(item.id) && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
                <span
                  className={`flex-1 ${
                    checkedItems.has(item.id)
                      ? 'text-neutral-400 line-through'
                      : 'text-neutral-900'
                  }`}
                >
                  {item.text}
                </span>
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => handleCheck(item.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
