import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

interface ChecklistItem {
  id: string;
  text: string;
  tip?: string;
}

interface Phase {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const phases: Phase[] = [
  {
    id: 'preparation',
    title: '1. 준비 단계',
    items: [
      { id: 'p1', text: '현재 회사에서의 불만 사항 정리', tip: '감정적인 결정이 아닌지 확인' },
      { id: 'p2', text: '이직 목표 명확히 하기', tip: '연봉, 성장, 워라밸 중 우선순위 설정' },
      { id: 'p3', text: '현재 시장에서 내 가치 파악', tip: '채용 공고와 네트워크를 통해 시세 확인' },
      { id: 'p4', text: '비상금 3개월치 이상 확보', tip: '이직 기간 대비' },
      { id: 'p5', text: '이직 타이밍 검토', tip: '성과급, 스톡옵션 일정 확인' },
    ],
  },
  {
    id: 'resume',
    title: '2. 이력서 준비',
    items: [
      { id: 'r1', text: '이력서 최신화', tip: '최근 프로젝트와 성과 위주' },
      { id: 'r2', text: '성과를 숫자로 정량화', tip: '매출 증가율, 효율 개선 수치' },
      { id: 'r3', text: '포트폴리오/GitHub 정리' },
      { id: 'r4', text: 'LinkedIn 프로필 업데이트' },
      { id: 'r5', text: '자기소개서 템플릿 준비' },
    ],
  },
  {
    id: 'search',
    title: '3. 채용 정보 탐색',
    items: [
      { id: 's1', text: '목표 회사 리스트 작성', tip: '10개 이상 후보군' },
      { id: 's2', text: '각 회사 문화/리뷰 조사', tip: '잡플래닛, 블라인드 활용' },
      { id: 's3', text: '지인 네트워크 활용', tip: '내부 추천 적극 활용' },
      { id: 's4', text: '채용 플랫폼 프로필 등록' },
      { id: 's5', text: '헤드헌터 컨택', tip: '경력 5년 이상 추천' },
    ],
  },
  {
    id: 'interview',
    title: '4. 면접 준비',
    items: [
      { id: 'i1', text: '예상 질문 및 답변 준비', tip: '자기소개, 이직 사유, 강점/약점' },
      { id: 'i2', text: '기술 면접 대비' },
      { id: 'i3', text: '회사에 대한 질문 준비', tip: '팀 구성, 기술 스택, 성장 기회' },
      { id: 'i4', text: '면접 복장 준비' },
      { id: 'i5', text: '면접 후 감사 메일 발송' },
    ],
  },
  {
    id: 'negotiation',
    title: '5. 오퍼 협상',
    items: [
      { id: 'n1', text: '연봉 협상 준비', tip: '현재 연봉 + 시장 시세 기준' },
      { id: 'n2', text: '연봉 외 복리후생 확인', tip: '스톡옵션, 성과급, 재택근무' },
      { id: 'n3', text: '입사일 협의' },
      { id: 'n4', text: '계약서 확인', tip: '경업금지, 수습 조건' },
      { id: 'n5', text: '최종 결정 전 하루 생각하기' },
    ],
  },
  {
    id: 'resignation',
    title: '6. 퇴사 프로세스',
    items: [
      { id: 'd1', text: '퇴사 의사 전달', tip: '최소 한 달 전' },
      { id: 'd2', text: '퇴사 서류 제출' },
      { id: 'd3', text: '인수인계 문서 작성' },
      { id: 'd4', text: '회사 자산 반납' },
      { id: 'd5', text: '퇴직금 및 4대보험 확인' },
      { id: 'd6', text: '동료들에게 인사' },
    ],
  },
];

const STORAGE_KEY = 'han-job-guide-progress';

function loadProgress(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return new Set(JSON.parse(saved));
  } catch {
    // ignore
  }
  return new Set();
}

function saveProgress(items: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
}

function PhaseSection({
  phase,
  checkedItems,
  onCheck,
}: {
  phase: Phase;
  checkedItems: Set<string>;
  onCheck: (id: string) => void;
}) {
  const checkedCount = phase.items.filter((item) => checkedItems.has(item.id)).length;
  const progress = (checkedCount / phase.items.length) * 100;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-900">{phase.title}</h3>
          <span className="text-sm text-neutral-500">
            {checkedCount}/{phase.items.length}
          </span>
        </div>
        <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="divide-y divide-neutral-100">
        {phase.items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 px-6 py-4 cursor-pointer hover:bg-neutral-50"
          >
            <input
              type="checkbox"
              checked={checkedItems.has(item.id)}
              onChange={() => onCheck(item.id)}
              className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
            />
            <div className="flex-1">
              <span
                className={`text-sm ${
                  checkedItems.has(item.id) ? 'text-neutral-400 line-through' : 'text-neutral-900'
                }`}
              >
                {item.text}
              </span>
              {item.tip && (
                <p className="text-xs text-neutral-400 mt-0.5">{item.tip}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export function JobGuidePage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(loadProgress);

  const handleCheck = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      saveProgress(next);
      return next;
    });
  };

  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const totalProgress = (checkedItems.size / totalItems) * 100;

  const handleReset = () => {
    if (confirm('모든 진행 상황을 초기화하시겠습니까?')) {
      setCheckedItems(new Set());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={ROUTES.HOME}
          className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 inline-block"
        >
          ← 홈
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">이직 가이드</h1>
            <p className="text-sm text-neutral-500 mt-1">
              이직의 전 과정을 체크리스트로 관리하세요.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-neutral-400 hover:text-red-500"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">전체 진행률</span>
          <span className="text-2xl font-bold">{Math.round(totalProgress)}%</span>
        </div>
        <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          {checkedItems.size}/{totalItems} 완료
        </p>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            checkedItems={checkedItems}
            onCheck={handleCheck}
          />
        ))}
      </div>
    </div>
  );
}
