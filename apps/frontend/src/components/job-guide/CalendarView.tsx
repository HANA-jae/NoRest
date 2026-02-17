'use client';

import type { JobGuidePhase, CalendarItem } from '@/types';

interface CalendarViewProps {
  phases: JobGuidePhase[];
  onToggleCompletion: (itemCode: string, currentStatus: boolean) => void;
}

function buildCalendarItems(phases: JobGuidePhase[]): CalendarItem[] {
  const items: CalendarItem[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  phases.forEach((phase) => {
    phase.items.forEach((item) => {
      if (item.targetDate) {
        const target = new Date(item.targetDate + 'T00:00:00');
        items.push({
          itemCode: item.itemCode,
          itemTitle: item.itemTitle,
          targetDate: item.targetDate,
          isCompleted: item.isCompleted,
          phaseTitle: phase.phaseTitle,
          dDay: Math.ceil((target.getTime() - today.getTime()) / 86400000),
        });
      }
    });
  });

  return items.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
}

function groupByMonth(
  items: CalendarItem[],
): Map<string, CalendarItem[]> {
  const groups = new Map<string, CalendarItem[]>();
  items.forEach((item) => {
    const key = item.targetDate.substring(0, 7);
    const existing = groups.get(key) || [];
    existing.push(item);
    groups.set(key, existing);
  });
  return groups;
}

function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${year}년 ${parseInt(month)}월`;
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month)}/${parseInt(day)} (${days[date.getDay()]})`;
}

const PHASE_COLORS: Record<string, string> = {
  '준비': 'bg-blue-50 text-blue-600 border-blue-200',
  '이력서': 'bg-purple-50 text-purple-600 border-purple-200',
  '탐색': 'bg-green-50 text-green-600 border-green-200',
  '면접': 'bg-amber-50 text-amber-600 border-amber-200',
  '협상': 'bg-orange-50 text-orange-600 border-orange-200',
  '퇴사': 'bg-red-50 text-red-600 border-red-200',
};

function getPhaseColor(phaseTitle: string): string {
  return PHASE_COLORS[phaseTitle] || 'bg-neutral-50 text-neutral-600 border-neutral-200';
}

export function CalendarView({ phases, onToggleCompletion }: CalendarViewProps) {
  const calendarItems = buildCalendarItems(phases);
  const grouped = groupByMonth(calendarItems);

  const totalWithDates = calendarItems.length;
  const completedWithDates = calendarItems.filter((i) => i.isCompleted).length;
  const overdueCount = calendarItems.filter((i) => !i.isCompleted && i.dDay < 0).length;

  if (calendarItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-300" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <p className="text-neutral-500 font-medium mb-1">목표일이 설정된 항목이 없습니다</p>
        <p className="text-neutral-400 text-sm">
          체크리스트 뷰에서 항목 상세를 열어 목표일을 설정해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Bar */}
      <div className="flex items-center gap-6 bg-white border border-neutral-200 rounded-xl px-5 py-3.5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-400" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-neutral-600">
            총 <span className="font-semibold text-neutral-900">{totalWithDates}</span>개 일정
          </span>
        </div>
        <span className="text-neutral-200">|</span>
        <span className="text-sm text-neutral-600">
          완료 <span className="font-semibold text-green-600">{completedWithDates}</span>
        </span>
        {overdueCount > 0 && (
          <>
            <span className="text-neutral-200">|</span>
            <span className="text-sm text-red-600 font-medium">
              지연 {overdueCount}
            </span>
          </>
        )}
      </div>

      {/* Timeline */}
      {Array.from(grouped.entries()).map(([yearMonth, items]) => (
        <div key={yearMonth}>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-bold text-neutral-900">
              {formatMonthLabel(yearMonth)}
            </h3>
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
              {items.length}개
            </span>
          </div>
          <div className="space-y-2 relative ml-3">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-4 bottom-4 w-px bg-neutral-200" />

            {items.map((item) => (
              <div
                key={item.itemCode}
                className={`flex items-center gap-4 pl-0 pr-4 py-3 rounded-xl transition-all hover:bg-neutral-50 ${
                  item.isCompleted ? 'opacity-50' : ''
                }`}
              >
                {/* Timeline dot */}
                <button
                  onClick={() =>
                    onToggleCompletion(item.itemCode, item.isCompleted)
                  }
                  className={`relative z-10 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    item.isCompleted
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : item.dDay < 0
                        ? 'border-red-400 bg-white hover:bg-red-50'
                        : item.dDay === 0
                          ? 'border-neutral-900 bg-white hover:bg-neutral-100'
                          : 'border-neutral-300 bg-white hover:bg-neutral-50'
                  }`}
                >
                  {item.isCompleted && (
                    <svg className="w-2.5 h-2.5" fill="none" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Date */}
                <span className="text-xs text-neutral-500 tabular-nums w-20 shrink-0 font-medium">
                  {formatDay(item.targetDate)}
                </span>

                {/* Phase badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-medium ${getPhaseColor(item.phaseTitle)}`}>
                  {item.phaseTitle}
                </span>

                {/* Title */}
                <span
                  className={`flex-1 text-sm ${
                    item.isCompleted
                      ? 'text-neutral-400 line-through'
                      : 'text-neutral-900'
                  }`}
                >
                  {item.itemTitle}
                </span>

                {/* D-Day */}
                {!item.isCompleted && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full shrink-0 font-medium ${
                      item.dDay < 0
                        ? 'bg-red-50 text-red-600'
                        : item.dDay === 0
                          ? 'bg-neutral-900 text-white'
                          : item.dDay <= 3
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-neutral-50 text-neutral-400'
                    }`}
                  >
                    {item.dDay === 0
                      ? 'D-Day'
                      : item.dDay > 0
                        ? `D-${item.dDay}`
                        : `D+${Math.abs(item.dDay)}`}
                  </span>
                )}
                {item.isCompleted && (
                  <span className="text-xs text-green-600 font-medium">완료</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
