'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useJobGuide } from '@/hooks/useJobGuide';
import { useJobGuideStore } from '@/store/job-guide.store';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { ItemDetailModal } from '@/components/job-guide/ItemDetailModal';
import { PhaseNoteSection } from '@/components/job-guide/PhaseNoteSection';
import { CustomItemForm } from '@/components/job-guide/CustomItemForm';
import { CalendarView } from '@/components/job-guide/CalendarView';
import { DownloadsSection } from '@/components/job-guide/DownloadsSection';
import { CustomItemPresets } from '@/components/job-guide/CustomItemPresets';
import { QuickStats } from '@/components/job-guide/QuickStats';
import { FAQSection } from '@/components/job-guide/FAQSection';
import { PhaseCelebration } from '@/components/job-guide/PhaseCelebration';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, AnimatedProgress, motion, AnimatePresence } from '@/components/motion';
import type { JobGuideItem } from '@/types';

type FilterMode = 'all' | 'pending' | 'completed';
type ViewMode = 'checklist' | 'calendar' | 'templates' | 'faq';

const PHASE_ICONS: Record<string, string> = {
  preparation: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  resume: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  interview: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  negotiation: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  resignation: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
};

const VIEW_TABS: { key: ViewMode; label: string; icon: string }[] = [
  {
    key: 'checklist',
    label: '체크리스트',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    key: 'calendar',
    label: '캘린더',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    key: 'templates',
    label: '템플릿',
    icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  },
  {
    key: 'faq',
    label: 'FAQ',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

function getDDay(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default function JobGuidePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openLoginModal = useUiStore((state) => state.openLoginModal);

  const {
    phases,
    overallProgress,
    isLoading,
    error,
    toggleItemCompletion,
    toggleItemDisabled,
    toggleCustomItemCompletion,
    setTargetDate,
    createNote,
    updateNote,
    deleteNote,
    createCustomItem,
    deleteCustomItem,
  } = useJobGuide();
  const { activePhaseId, setActivePhaseId, celebratingPhase, isAllPhasesComplete, setCelebratingPhase } = useJobGuideStore();
  const [selectedItem, setSelectedItem] = useState<JobGuideItem | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('checklist');

  // 현재 활성 단계 찾기
  const currentPhase = useMemo(
    () => phases.find((p) => p.phaseId === activePhaseId) || phases[0],
    [phases, activePhaseId],
  );

  // 단계별 진행률 계산 (비활성화 항목 제외)
  const phaseProgress = useMemo(() => {
    if (!currentPhase) return 0;
    const activeItems = currentPhase.items.filter((i) => !i.isDisabled);
    if (activeItems.length === 0) return 0;
    const completed = activeItems.filter((i) => i.isCompleted).length;
    return (completed / activeItems.length) * 100;
  }, [currentPhase]);

  // 비활성화 항목 표시 여부
  const [showDisabled, setShowDisabled] = useState(false);

  // 필터링된 아이템
  const filteredItems = useMemo(() => {
    if (!currentPhase) return [];
    let items = currentPhase.items;
    if (filterMode === 'pending')
      items = items.filter((i) => !i.isCompleted && !i.isDisabled);
    else if (filterMode === 'completed')
      items = items.filter((i) => i.isCompleted);
    else
      items = showDisabled ? items : items.filter((i) => !i.isDisabled);
    return items;
  }, [currentPhase, filterMode, showDisabled]);

  // 비활성화 항목 수
  const disabledCount = useMemo(() => {
    if (!currentPhase) return 0;
    return currentPhase.items.filter((i) => i.isDisabled).length;
  }, [currentPhase]);

  // 필터별 카운트 (비활성화 항목 제외)
  const filterCounts = useMemo(() => {
    if (!currentPhase) return { all: 0, pending: 0, completed: 0 };
    const activeItems = currentPhase.items.filter((i) => !i.isDisabled);
    const completed = activeItems.filter((i) => i.isCompleted).length;
    return {
      all: activeItems.length,
      pending: activeItems.length - completed,
      completed,
    };
  }, [currentPhase]);

  const handleCheck = (itemCode: string, currentStatus: boolean) => {
    if (itemCode.startsWith('custom_')) {
      const customItemId = Number(itemCode.replace('custom_', ''));
      toggleCustomItemCompletion(customItemId);
    } else {
      toggleItemCompletion(itemCode, currentStatus);
    }
  };

  const handleSetTargetDate = async (
    itemCode: string,
    date: string | null,
  ) => {
    await setTargetDate(itemCode, date);
  };

  // 메모 저장 (신규 생성 또는 업데이트)
  const handleSaveNote = async (itemCode: string, noteContent: string) => {
    const item = currentPhase?.items.find((i) => i.itemCode === itemCode);
    if (!item) return;

    if (item.noteId) {
      await updateNote(item.noteId, { content: noteContent });
    } else {
      await createNote({
        noteType: 'ITEM',
        itemCode,
        content: noteContent,
      });
    }
  };

  // 메모 삭제
  const handleDeleteNote = async (itemCode: string) => {
    const item = currentPhase?.items.find((i) => i.itemCode === itemCode);
    if (!item?.noteId) return;
    await deleteNote(item.noteId);
  };

  // 단계 메모 저장
  const handleSavePhaseNote = async (
    templateId: number,
    noteId: number | undefined,
    content: string,
  ) => {
    if (noteId) {
      await updateNote(noteId, { content });
    } else {
      await createNote({
        noteType: 'PHASE',
        templateId,
        content,
      });
    }
  };

  // 단계 메모 삭제
  const handleDeletePhaseNote = async (noteId: number) => {
    await deleteNote(noteId);
  };

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 mb-12 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>홈으로</span>
        </Link>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <ScaleIn delay={0.1}>
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </ScaleIn>
            <FadeIn delay={0.25}>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-3">
                이직 가이드
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-neutral-500 mb-2 leading-relaxed">
                준비부터 퇴사까지, 6단계 체크리스트로<br />
                체계적인 이직을 준비하세요.
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-sm text-neutral-400 mb-8">
                목표일 설정, 메모, 맞춤 항목 추가까지 한 곳에서
              </p>
            </FadeIn>
            <FadeIn delay={0.65}>
              <button
                onClick={openLoginModal}
                className="px-8 py-3.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all font-medium shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 hover:-translate-y-0.5"
              >
                로그인하고 시작하기
              </button>
            </FadeIn>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading && phases.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-neutral-100" />
              <div className="absolute inset-0 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
            </div>
            <p className="text-neutral-500 font-medium">이직 가이드를 불러오는 중...</p>
            <p className="text-neutral-300 text-sm mt-1">잠시만 기다려주세요</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error && phases.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-neutral-900 font-medium mb-2">데이터를 불러올 수 없습니다</p>
            <p className="text-neutral-400 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = overallProgress?.progressPercentage || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 mb-6 sm:mb-10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>홈으로</span>
      </Link>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-1.5">
            이직 가이드
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            {progressPct === 0
              ? '체크리스트를 완료하며 이직을 체계적으로 준비하세요'
              : progressPct === 100
                ? '모든 준비를 마쳤어요! 새로운 시작을 응원합니다'
                : `${overallProgress?.completedItems || 0}개 항목을 완료했어요. 꾸준히 진행해보세요`}
          </p>
        </div>
        {/* View Toggle */}
        <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 self-start shrink-0">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === tab.key
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
              title={tab.label}
            >
              <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6 sm:mb-8 bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
              전체 진행률
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-bold tabular-nums text-neutral-900">
                {progressPct}
              </span>
              <span className="text-lg text-neutral-300 font-medium">%</span>
            </div>
          </div>
          {overallProgress && (
            <span className="text-sm text-neutral-400 tabular-nums">
              {overallProgress.completedItems} / {overallProgress.totalItems} 완료
            </span>
          )}
        </div>
        <AnimatedProgress
          value={progressPct}
          delay={0.3}
          duration={0.8}
          className="h-2 bg-neutral-100 rounded-full overflow-hidden"
          barClassName="h-full bg-neutral-900 rounded-full"
        />
        {/* Phase Mini Indicators */}
        <div className="flex items-center gap-1.5 mt-4">
          {phases.map((phase) => {
            const done = phase.items.filter((i) => i.isCompleted).length;
            const total = phase.items.length;
            const isComplete = done === total && total > 0;
            const hasProgress = done > 0;
            return (
              <button
                key={phase.phaseId}
                onClick={() => {
                  setActivePhaseId(phase.phaseId);
                  setViewMode('checklist');
                }}
                className="group flex items-center gap-1.5 flex-1"
                title={`${phase.phaseTitle}: ${done}/${total}`}
              >
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${
                    isComplete
                      ? 'bg-neutral-900'
                      : hasProgress
                        ? 'bg-neutral-400'
                        : 'bg-neutral-200 group-hover:bg-neutral-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {phases.map((phase) => {
            const done = phase.items.filter((i) => i.isCompleted).length;
            const total = phase.items.length;
            return (
              <span key={phase.phaseId} className="text-[10px] text-neutral-300 tabular-nums flex-1 text-center">
                {done}/{total}
              </span>
            );
          })}
        </div>
      </div>

      {/* Quick Stats (checklist view only) */}
      {viewMode === 'checklist' && (
        <QuickStats phases={phases} overallProgress={overallProgress} />
      )}

      {viewMode === 'faq' ? (
        <FAQSection />
      ) : viewMode === 'templates' ? (
        <DownloadsSection />
      ) : viewMode === 'calendar' ? (
        <CalendarView
          phases={phases}
          onToggleCompletion={handleCheck}
        />
      ) : (
        <>
          {/* Phase Timeline */}
          <div className="flex items-center mb-8 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-1 scrollbar-hide">
            {phases.map((phase, i) => {
              const done = phase.items.filter((item) => item.isCompleted).length;
              const total = phase.items.length;
              const isComplete = done === total && total > 0;
              const isActive = activePhaseId === phase.phaseId;
              const hasProgress = done > 0;
              return (
                <div
                  key={phase.phaseId}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <button
                    onClick={() => setActivePhaseId(phase.phaseId)}
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isComplete
                          ? 'bg-neutral-900 text-white shadow-md shadow-neutral-900/20'
                          : isActive
                            ? 'border-2 border-neutral-900 bg-white text-neutral-900'
                            : hasProgress
                              ? 'border-2 border-neutral-400 bg-white text-neutral-400'
                              : 'border-2 border-neutral-200 bg-white text-neutral-300 group-hover:border-neutral-400 group-hover:text-neutral-400'
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-4 h-4" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] leading-tight text-center transition-colors whitespace-nowrap ${
                        isActive
                          ? 'text-neutral-900 font-semibold'
                          : isComplete
                            ? 'text-neutral-600 font-medium'
                            : 'text-neutral-400 group-hover:text-neutral-600'
                      }`}
                    >
                      {phase.phaseTitle}
                    </span>
                  </button>
                  {i < phases.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 -mt-5 transition-colors ${
                        isComplete ? 'bg-neutral-900' : hasProgress ? 'bg-neutral-300' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-10">
            {/* Phase Nav — 모바일: 가로 스크롤, 데스크톱: 세로 사이드바 */}
            <nav className="flex md:flex-col gap-2 md:gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {phases.map((phase) => {
                const done = phase.items.filter((i) => i.isCompleted).length;
                const total = phase.items.length;
                const isComplete = done === total && total > 0;
                const pct = total > 0 ? (done / total) * 100 : 0;
                const isActive = activePhaseId === phase.phaseId;
                const iconPath = PHASE_ICONS[phase.phaseId] || PHASE_ICONS.preparation;

                return (
                  <button
                    key={phase.phaseId}
                    onClick={() => {
                      setActivePhaseId(phase.phaseId);
                      setFilterMode('all');
                    }}
                    className={`w-full min-w-40 md:min-w-0 shrink-0 md:shrink flex flex-col gap-2.5 px-4 py-3.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/15'
                        : 'hover:bg-neutral-50 border border-transparent hover:border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-400' : 'text-neutral-300'}`}
                        fill="none"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                      <span className="flex-1 font-medium text-sm">{phase.phaseTitle}</span>
                      {isComplete ? (
                        <span className={`text-xs ${isActive ? 'text-green-400' : 'text-green-600'}`}>
                          <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      ) : (
                        <span
                          className={`text-xs tabular-nums ${
                            isActive ? 'text-neutral-400' : 'text-neutral-400'
                          }`}
                        >
                          {done}/{total}
                        </span>
                      )}
                    </div>
                    <div
                      className={`h-1 rounded-full overflow-hidden ${
                        isActive ? 'bg-neutral-700' : 'bg-neutral-100'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isActive ? 'bg-white' : 'bg-neutral-900'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Checklist */}
            <div>
              {currentPhase && (
                <>
                  {/* Phase Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-neutral-900">
                        {currentPhase.phaseTitle}
                      </h2>
                      {currentPhase.estimatedDays && (
                        <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                          약 {currentPhase.estimatedDays}일 소요
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                      <span className="text-sm text-neutral-400 tabular-nums font-medium">
                        {Math.round(phaseProgress)}%
                      </span>
                    </div>
                  </div>

                  {currentPhase.description && (
                    <p className="text-sm text-neutral-500 mb-5 leading-relaxed">
                      {currentPhase.description}
                    </p>
                  )}

                  {/* Phase Note */}
                  <PhaseNoteSection
                    templateId={currentPhase.templateId}
                    phaseNoteId={currentPhase.phaseNoteId}
                    phaseNote={currentPhase.phaseNote}
                    onSave={handleSavePhaseNote}
                    onDelete={handleDeletePhaseNote}
                  />

                  {/* Filter Toggle */}
                  <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 mb-5">
                    {(
                      [
                        { key: 'all', label: '전체' },
                        { key: 'pending', label: '미완료' },
                        { key: 'completed', label: '완료' },
                      ] as const
                    ).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFilterMode(key)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          filterMode === key
                            ? 'bg-white text-neutral-900 shadow-sm'
                            : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                      >
                        {label}
                        <span className={`ml-1.5 text-xs tabular-nums ${
                          filterMode === key ? 'text-neutral-500' : 'text-neutral-300'
                        }`}>
                          {filterCounts[key]}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Disabled Items Toggle */}
                  {disabledCount > 0 && filterMode === 'all' && (
                    <div className="mb-3">
                      <button
                        onClick={() => setShowDisabled(!showDisabled)}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${showDisabled ? 'rotate-90' : ''}`} fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        비활성화 항목 {disabledCount}개 {showDisabled ? '숨기기' : '보기'}
                      </button>
                    </div>
                  )}

                  {/* Items */}
                  <StaggerContainer className="space-y-2" stagger={0.05} key={`${activePhaseId}-${filterMode}`}>
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-neutral-300" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                            {filterMode === 'completed' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            )}
                          </svg>
                        </div>
                        <p className="text-neutral-400 text-sm">
                          {filterMode === 'completed'
                            ? '아직 완료한 항목이 없어요'
                            : '모든 항목을 완료했어요!'}
                        </p>
                      </div>
                    ) : (
                      filteredItems.map((item) => {
                        const dDay = item.targetDate
                          ? getDDay(item.targetDate)
                          : null;
                        const isCustom = item.itemCode.startsWith('custom_');

                        return (
                          <StaggerItem key={item.itemCode}>
                          <div
                            className={`group flex items-center gap-4 p-4 rounded-xl transition-all ${
                              item.isDisabled
                                ? 'bg-neutral-50/50 opacity-50'
                                : item.isCompleted
                                  ? 'bg-neutral-50'
                                  : 'bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                            }`}
                          >
                            <button
                              onClick={() =>
                                !item.isDisabled && handleCheck(item.itemCode, item.isCompleted)
                              }
                              disabled={item.isDisabled}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                item.isDisabled
                                  ? 'border-neutral-200 bg-neutral-100 cursor-not-allowed'
                                  : item.isCompleted
                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                    : 'border-neutral-300 hover:border-neutral-500'
                              }`}
                            >
                              {item.isCompleted && !item.isDisabled && (
                                <svg className="w-3 h-3" fill="none" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {item.isDisabled && (
                                <svg className="w-3 h-3 text-neutral-300" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => !item.isDisabled && setSelectedItem(item)}
                              disabled={item.isDisabled}
                              className={`flex-1 text-left text-sm ${
                                item.isDisabled
                                  ? 'text-neutral-300 line-through cursor-default'
                                  : item.isCompleted
                                    ? 'text-neutral-400 line-through'
                                    : 'text-neutral-900 hover:text-neutral-600'
                              }`}
                            >
                              <span>{item.itemTitle}</span>
                              {isCustom && (
                                <span className="ml-2 text-[10px] text-neutral-300 font-medium">커스텀</span>
                              )}
                            </button>
                            {/* Badges */}
                            <div className="flex items-center gap-2 shrink-0">
                              {!item.isDisabled && dDay !== null && !item.isCompleted && (
                                <span
                                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                    dDay < 0
                                      ? 'bg-red-50 text-red-600'
                                      : dDay === 0
                                        ? 'bg-neutral-900 text-white'
                                        : dDay <= 3
                                          ? 'bg-amber-50 text-amber-600'
                                          : 'bg-neutral-50 text-neutral-400'
                                  }`}
                                >
                                  {dDay === 0
                                    ? 'D-Day'
                                    : dDay > 0
                                      ? `D-${dDay}`
                                      : `D+${Math.abs(dDay)}`}
                                </span>
                              )}
                              {!item.isDisabled && item.note && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="메모 있음" />
                              )}
                              {/* 비활성화 토글 (기본 항목만) */}
                              {!isCustom && (
                                <button
                                  onClick={() => toggleItemDisabled(item.itemCode, item.isDisabled)}
                                  className={`transition-colors opacity-0 group-hover:opacity-100 ${
                                    item.isDisabled
                                      ? 'text-neutral-400 hover:text-neutral-900 opacity-100!'
                                      : 'text-neutral-200 hover:text-neutral-500'
                                  }`}
                                  title={item.isDisabled ? '항목 활성화' : '항목 비활성화'}
                                >
                                  {item.isDisabled ? (
                                    <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                  )}
                                </button>
                              )}
                              {isCustom && (
                                <button
                                  onClick={() => {
                                    const id = Number(
                                      item.itemCode.replace('custom_', ''),
                                    );
                                    deleteCustomItem(id);
                                  }}
                                  className="text-neutral-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                  title="삭제"
                                >
                                  <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                              {!item.isDisabled && (
                                <button
                                  onClick={() => setSelectedItem(item)}
                                  className="text-neutral-300 hover:text-neutral-900 transition-colors"
                                  title="상세 보기"
                                >
                                  <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          </StaggerItem>
                        );
                      })
                    )}
                  </StaggerContainer>

                  {/* Custom Item Add */}
                  <div className="mt-5 space-y-3">
                    {/* Preset Templates */}
                    <CustomItemPresets
                      phaseId={currentPhase.phaseId}
                      templateId={currentPhase.templateId}
                      nextOrder={
                        currentPhase.items.length > 0
                          ? Math.max(
                              ...currentPhase.items.map((i) => i.itemOrder),
                            ) + 1
                          : 1
                      }
                      existingTitles={currentPhase.items.map((i) => i.itemTitle)}
                      onAdd={createCustomItem}
                    />

                    {/* Manual Add */}
                    {showCustomForm ? (
                      <CustomItemForm
                        templateId={currentPhase.templateId}
                        nextOrder={
                          currentPhase.items.length > 0
                            ? Math.max(
                                ...currentPhase.items.map((i) => i.itemOrder),
                              ) + 1
                            : 1
                        }
                        onSave={createCustomItem}
                        onCancel={() => setShowCustomForm(false)}
                      />
                    ) : (
                      <button
                        onClick={() => setShowCustomForm(true)}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600 transition-all hover:bg-neutral-50"
                      >
                        <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm">직접 항목 추가</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onSetTargetDate={handleSetTargetDate}
      />

      {/* Phase Completion Celebration */}
      <PhaseCelebration
        phaseTitle={celebratingPhase}
        isAllComplete={isAllPhasesComplete}
        onDismiss={() => {
          setCelebratingPhase(null);
          useJobGuideStore.setState({ isAllPhasesComplete: false });
        }}
      />
    </div>
  );
}
