'use client';

import type { JobGuidePhase, OverallProgress } from '@/types';

interface QuickStatsProps {
  phases: JobGuidePhase[];
  overallProgress: OverallProgress | null;
}

function getItemsWithTargetDate(phases: JobGuidePhase[]) {
  const items: { itemTitle: string; targetDate: string; isCompleted: boolean; phaseTitle: string }[] = [];
  phases.forEach((phase) => {
    phase.items.forEach((item) => {
      if (item.isDisabled) return;
      if (item.targetDate && !item.isCompleted) {
        items.push({
          itemTitle: item.itemTitle,
          targetDate: item.targetDate,
          isCompleted: item.isCompleted,
          phaseTitle: phase.phaseTitle,
        });
      }
    });
  });
  return items.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
}

export function QuickStats({ phases, overallProgress }: QuickStatsProps) {
  if (!overallProgress || phases.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

  const pendingWithDates = getItemsWithTargetDate(phases);

  const overdueCount = pendingWithDates.filter((item) => {
    const target = new Date(item.targetDate + 'T00:00:00');
    return target < today;
  }).length;

  const dueThisWeek = pendingWithDates.filter((item) => {
    const target = new Date(item.targetDate + 'T00:00:00');
    return target >= today && target <= endOfWeek;
  }).length;

  const nextDeadline = pendingWithDates[0];

  const completedPhases = phases.filter(
    (p) => {
      const active = p.items.filter((i) => !i.isDisabled);
      return active.length > 0 && active.every((i) => i.isCompleted);
    },
  ).length;

  const currentPhase = phases.find(
    (p) => {
      const active = p.items.filter((i) => !i.isDisabled);
      return active.length > 0 && active.some((i) => i.isCompleted) && !active.every((i) => i.isCompleted);
    },
  );

  const stats = [
    {
      label: '완료 단계',
      value: `${completedPhases}/${phases.length}`,
      accent: completedPhases === phases.length ? 'text-green-600' : 'text-neutral-900',
      bgAccent: completedPhases === phases.length ? 'bg-green-50 border-green-200' : 'bg-white border-neutral-200',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: completedPhases === phases.length ? 'text-green-400' : 'text-neutral-300',
    },
    {
      label: '이번 주 마감',
      value: String(dueThisWeek),
      accent: dueThisWeek > 0 ? 'text-amber-600' : 'text-neutral-900',
      bgAccent: dueThisWeek > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-neutral-200',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      iconColor: dueThisWeek > 0 ? 'text-amber-400' : 'text-neutral-300',
    },
    {
      label: '지연 항목',
      value: String(overdueCount),
      accent: overdueCount > 0 ? 'text-red-600' : 'text-neutral-900',
      bgAccent: overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-200',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      iconColor: overdueCount > 0 ? 'text-red-400' : 'text-neutral-300',
    },
    {
      label: '남은 항목',
      value: String(overallProgress.totalItems - overallProgress.completedItems),
      accent: 'text-neutral-900',
      bgAccent: 'bg-white border-neutral-200',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      iconColor: 'text-neutral-300',
    },
  ];

  const pct = overallProgress.progressPercentage;
  let message = '';
  let messageIcon = '';
  if (pct === 0) {
    message = '첫 번째 항목을 완료하고 이직 여정을 시작하세요!';
    messageIcon = 'M13 10V3L4 14h7v7l9-11h-7z';
  } else if (pct < 25) {
    message = '좋은 시작이에요! 꾸준히 진행하면 곧 성과가 보일 거예요.';
    messageIcon = 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  } else if (pct < 50) {
    message = '순조롭게 진행 중이에요! 이 페이스를 유지해보세요.';
    messageIcon = 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6';
  } else if (pct < 75) {
    message = '절반 이상 완료했어요! 이직 준비가 잘 되고 있어요.';
    messageIcon = 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
  } else if (pct < 100) {
    message = '거의 다 됐어요! 마지막 스퍼트를 올려보세요.';
    messageIcon = 'M17.657 18.657A8 8 0 016.343 7.343S7 9.168 7 12a5 5 0 006.521 4.766c.194-.073.393-.13.582-.207M17.657 18.657L20 21';
  } else {
    message = '모든 항목을 완료했어요! 새로운 시작을 응원합니다.';
    messageIcon = 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z';
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`border rounded-xl px-4 py-3.5 ${stat.bgAccent}`}
          >
            <div className="flex items-center justify-between mb-2">
              <svg className={`w-5 h-5 ${stat.iconColor}`} fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${stat.accent}`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Motivational Message + Next Deadline */}
      <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-100 rounded-xl px-5 py-4">
        <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={messageIcon} />
        </svg>
        <p className="flex-1 text-sm text-neutral-600">{message}</p>
        {nextDeadline && (
          <div className="text-right shrink-0 border-l border-neutral-200 pl-4 ml-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium mb-0.5">다음 마감</p>
            <p className="text-xs font-medium text-neutral-700">
              {nextDeadline.itemTitle.length > 12
                ? nextDeadline.itemTitle.slice(0, 12) + '...'
                : nextDeadline.itemTitle}
            </p>
            <p className="text-[11px] text-neutral-400">
              {nextDeadline.targetDate.slice(5).replace('-', '/')}
            </p>
          </div>
        )}
      </div>

      {/* Phase Almost Complete Banner */}
      {currentPhase &&
        currentPhase.items.filter((i) => !i.isDisabled && i.isCompleted).length ===
          currentPhase.items.filter((i) => !i.isDisabled).length - 1 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{currentPhase.phaseTitle}</span> 단계까지 딱 1개 남았어요!
          </p>
        </div>
      )}
    </div>
  );
}
