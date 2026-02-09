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
  emoji: string;
  description: string;
  color: string;
  items: ChecklistItem[];
}

const phases: Phase[] = [
  {
    id: 'preparation',
    title: '준비 단계',
    emoji: '🎯',
    description: '이직을 결심하기 전 체크할 사항들',
    color: 'from-blue-500 to-blue-600',
    items: [
      { id: 'p1', text: '현재 회사에서의 불만 사항 정리하기', tip: '감정적인 결정이 아닌지 냉정하게 판단하세요' },
      { id: 'p2', text: '이직 목표 명확히 하기 (연봉? 성장? 워라밸?)', tip: '우선순위를 정해두면 선택이 쉬워집니다' },
      { id: 'p3', text: '현재 시장에서 내 가치 파악하기', tip: '채용 공고와 네트워크를 통해 시세 확인' },
      { id: 'p4', text: '비상금 3개월치 이상 확보하기', tip: '이직 기간이 길어질 수 있으니 대비하세요' },
      { id: 'p5', text: '이직 타이밍 검토하기', tip: '성과급, 스톡옵션 베스팅 일정 확인' },
    ],
  },
  {
    id: 'resume',
    title: '이력서 & 포트폴리오',
    emoji: '📝',
    description: '나를 효과적으로 어필하는 자료 준비',
    color: 'from-emerald-500 to-emerald-600',
    items: [
      { id: 'r1', text: '이력서 최신화하기', tip: '최근 프로젝트와 성과 위주로 정리' },
      { id: 'r2', text: '성과를 숫자로 정량화하기', tip: '매출 증가율, 효율 개선 수치 등' },
      { id: 'r3', text: '포트폴리오/GitHub 정리하기', tip: '개인 프로젝트도 좋은 어필 포인트' },
      { id: 'r4', text: 'LinkedIn 프로필 업데이트', tip: '영문 이력서 대용으로 활용 가능' },
      { id: 'r5', text: '자기소개서 템플릿 준비하기', tip: '회사별로 커스터마이징할 베이스' },
    ],
  },
  {
    id: 'search',
    title: '채용 정보 탐색',
    emoji: '🔍',
    description: '좋은 기회를 찾고 지원하기',
    color: 'from-violet-500 to-violet-600',
    items: [
      { id: 's1', text: '목표 회사 리스트 만들기', tip: '최소 10개 이상의 후보군 확보' },
      { id: 's2', text: '각 회사 문화/리뷰 조사하기', tip: '잡플래닛, 블라인드, 크레딧잡 활용' },
      { id: 's3', text: '지인 네트워크 활용하기', tip: '내부 추천은 합격률이 훨씬 높습니다' },
      { id: 's4', text: '채용 플랫폼 프로필 등록', tip: '원티드, 로켓펀치, 점핏 등' },
      { id: 's5', text: '헤드헌터 컨택하기', tip: '경력 5년 이상이면 적극 활용' },
    ],
  },
  {
    id: 'interview',
    title: '면접 준비',
    emoji: '💬',
    description: '면접에서 좋은 인상 남기기',
    color: 'from-amber-500 to-amber-600',
    items: [
      { id: 'i1', text: '예상 질문 리스트 작성 및 답변 준비', tip: '자기소개, 이직 사유, 강점/약점' },
      { id: 'i2', text: '기술 면접 대비 (해당 시)', tip: '코딩 테스트, 시스템 디자인 등' },
      { id: 'i3', text: '회사에 대한 질문 준비하기', tip: '팀 구성, 기술 스택, 성장 기회 등' },
      { id: 'i4', text: '면접 복장 준비하기', tip: '회사 분위기에 맞게 (IT는 보통 캐주얼)' },
      { id: 'i5', text: '면접 후 감사 메일 보내기', tip: '간단하게라도 인상 남기기' },
    ],
  },
  {
    id: 'negotiation',
    title: '오퍼 협상',
    emoji: '💰',
    description: '최선의 조건을 이끌어내기',
    color: 'from-rose-500 to-rose-600',
    items: [
      { id: 'n1', text: '연봉 협상 준비하기', tip: '현재 연봉 + 시장 시세 기준으로' },
      { id: 'n2', text: '연봉 외 복리후생 확인', tip: '스톡옵션, 성과급, 재택근무 등' },
      { id: 'n3', text: '입사일 협의하기', tip: '현 직장 인수인계 기간 고려' },
      { id: 'n4', text: '계약서 꼼꼼히 확인하기', tip: '경업금지, 퇴직금, 수습 조건 등' },
      { id: 'n5', text: '최종 결정 전 하루 생각하기', tip: '흥분 상태에서 결정하지 마세요' },
    ],
  },
  {
    id: 'resignation',
    title: '퇴사 프로세스',
    emoji: '👋',
    description: '깔끔하게 마무리하기',
    color: 'from-neutral-600 to-neutral-700',
    items: [
      { id: 'd1', text: '퇴사 의사 상사에게 전달', tip: '최소 한 달 전, 면담으로' },
      { id: 'd2', text: '퇴사 서류 제출', tip: '사직서, 퇴직원 등' },
      { id: 'd3', text: '인수인계 문서 작성', tip: '후임자를 위해 상세하게' },
      { id: 'd4', text: '회사 자산 반납', tip: '노트북, 보안카드, 법인카드 등' },
      { id: 'd5', text: '퇴직금 및 4대보험 확인', tip: '건강보험 임의계속가입 검토' },
      { id: 'd6', text: '동료들에게 인사하기', tip: '연락처 교환, 좋은 관계 유지' },
    ],
  },
];

function PhaseCard({
  phase,
  isActive,
  onToggle,
  progress,
  checkedItems,
  onCheck,
}: {
  phase: Phase;
  isActive: boolean;
  onToggle: () => void;
  progress: number;
  checkedItems: Set<string>;
  onCheck: (itemId: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
      >
        <div
          className={`w-14 h-14 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center text-2xl`}
        >
          {phase.emoji}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-neutral-800">{phase.title}</h3>
          <p className="text-sm text-neutral-500">{phase.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-medium text-neutral-600">
              {Math.round(progress)}%
            </span>
            <div className="w-20 h-2 bg-neutral-200 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${phase.color} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span
            className={`text-2xl text-neutral-400 transition-transform ${
              isActive ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Checklist */}
      {isActive && (
        <div className="px-6 pb-6 border-t border-neutral-100">
          <div className="space-y-3 mt-4">
            {phase.items.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => onCheck(item.id)}
                  className="mt-1 w-5 h-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <div className="flex-1">
                  <span
                    className={`block font-medium ${
                      checkedItems.has(item.id)
                        ? 'text-neutral-400 line-through'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.tip && (
                    <span className="block text-sm text-neutral-400 mt-1">
                      💡 {item.tip}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverallProgress({ phases, checkedItems }: { phases: Phase[]; checkedItems: Set<string> }) {
  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const completedItems = checkedItems.size;
  const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">전체 진행률</h2>
        <span className="text-3xl font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="h-4 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-white/70 text-sm mt-3">
        총 {totalItems}개 항목 중 {completedItems}개 완료
      </p>
    </div>
  );
}

const STORAGE_KEY = 'han-job-guide-progress';

function loadProgress(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveProgress(items: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
}

export function JobGuidePage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(loadProgress);
  const [activePhases, setActivePhases] = useState<Set<string>>(new Set(['preparation']));

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

  const togglePhase = (phaseId: string) => {
    setActivePhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const getPhaseProgress = (phase: Phase) => {
    const checked = phase.items.filter((item) => checkedItems.has(item.id)).length;
    return (checked / phase.items.length) * 100;
  };

  const handleReset = () => {
    if (confirm('모든 진행 상황을 초기화하시겠습니까?')) {
      setCheckedItems(new Set());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 mb-4"
        >
          ← 홈으로
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">이직 가이드</h1>
            <p className="text-neutral-500 mt-2">
              이직의 모든 단계를 체크리스트로 관리하세요.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-neutral-400 hover:text-danger-500"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <OverallProgress phases={phases} checkedItems={checkedItems} />

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isActive={activePhases.has(phase.id)}
            onToggle={() => togglePhase(phase.id)}
            progress={getPhaseProgress(phase)}
            checkedItems={checkedItems}
            onCheck={handleCheck}
          />
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 bg-brand-50 rounded-2xl">
        <h3 className="font-semibold text-brand-800 mb-3">📌 이직 꿀팁</h3>
        <ul className="text-sm text-brand-700 space-y-2">
          <li>• 이직은 마라톤입니다. 조급해하지 마세요.</li>
          <li>• 현 직장에서 최선을 다하면서 준비하세요.</li>
          <li>• 인맥은 최고의 채용 경로입니다. 관계를 소중히 하세요.</li>
          <li>• 면접 후 피드백을 요청하면 다음 면접에 도움이 됩니다.</li>
          <li>• 연봉만 보지 말고 성장 가능성도 고려하세요.</li>
        </ul>
      </div>
    </div>
  );
}
