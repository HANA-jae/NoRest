export type CategoryId = 'job' | 'growth' | 'compensation' | 'environment' | 'balance' | 'emotional';
export type GradeType = 'LEAVE_NOW' | 'PREPARE' | 'EXPLORE' | 'WAIT' | 'STAY';

export interface Question {
  id: number;
  category: CategoryId;
  text: string;
  isReversed: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export interface GradeInfo {
  grade: GradeType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  actions: string[];
}

export interface QuizResult {
  score: number;
  grade: GradeType;
  gradeInfo: GradeInfo;
  categoryScores: Record<CategoryId, number>;
}

export const CATEGORIES: Category[] = [
  { id: 'job', name: '직무 만족도', description: '현재 업무에 대한 만족감' },
  { id: 'growth', name: '성장 가능성', description: '커리어 발전 기회' },
  { id: 'compensation', name: '보상/처우', description: '급여 및 복리후생' },
  { id: 'environment', name: '관계/환경', description: '동료 및 조직 문화' },
  { id: 'balance', name: '워라밸', description: '일과 삶의 균형' },
  { id: 'emotional', name: '정서적 상태', description: '직장으로 인한 감정' },
];

export const QUESTIONS: Question[] = [
  // 직무 만족도
  { id: 1, category: 'job', text: '출근길, 마음이 무겁다', isReversed: false },
  { id: 2, category: 'job', text: '지금 하는 일에서 의미를 느낀다', isReversed: true },

  // 성장 가능성
  { id: 3, category: 'growth', text: '최근 6개월간 성장했다고 느낀다', isReversed: true },
  { id: 4, category: 'growth', text: '3년 후 이 회사에서의 내 모습이 그려지지 않는다', isReversed: false },

  // 보상/처우
  { id: 5, category: 'compensation', text: '내 노력 대비 보상이 부족하다', isReversed: false },
  { id: 6, category: 'compensation', text: '연봉에 대체로 만족한다', isReversed: true },

  // 관계/환경
  { id: 7, category: 'environment', text: '팀원/상사와의 관계가 스트레스다', isReversed: false },
  { id: 8, category: 'environment', text: '회사 문화가 나와 맞는다', isReversed: true },

  // 워라밸
  { id: 9, category: 'balance', text: '퇴근 후에도 업무 생각이 떠나지 않는다', isReversed: false },
  { id: 10, category: 'balance', text: '개인 시간이 충분하다', isReversed: true },

  // 정서적 상태
  { id: 11, category: 'emotional', text: '일요일 저녁이 우울하다', isReversed: false },
  { id: 12, category: 'emotional', text: '회사 생각만 해도 피곤하다', isReversed: false },
];

export const ANSWER_OPTIONS = [
  { value: 0, label: '전혀', description: '전혀 그렇지 않다' },
  { value: 1, label: '아니', description: '그렇지 않다' },
  { value: 2, label: '보통', description: '보통이다' },
  { value: 3, label: '그래', description: '그렇다' },
  { value: 4, label: '매우', description: '매우 그렇다' },
];

export const GRADES: Record<GradeType, GradeInfo> = {
  LEAVE_NOW: {
    grade: 'LEAVE_NOW',
    title: '지금 당장',
    subtitle: '퇴사 임박',
    description: '이미 마음은 떠났습니다. 지금은 떠날 준비를 시작할 때입니다.',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    actions: [
      '비상금 3개월치 확보',
      '이력서 즉시 업데이트',
      '헤드헌터 적극 컨택',
      '퇴직금 계산 확인',
    ],
  },
  PREPARE: {
    grade: 'PREPARE',
    title: '탈출 준비',
    subtitle: '이직 준비기',
    description: '이직을 본격적으로 준비할 시점입니다. 시장을 살피며 기회를 찾으세요.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    actions: [
      '링크드인 프로필 업데이트',
      '업계 네트워크 확장',
      '포트폴리오 정리',
      '면접 준비 시작',
    ],
  },
  EXPLORE: {
    grade: 'EXPLORE',
    title: '탐색 중',
    subtitle: '옵션 열기',
    description: '완전히 떠날 준비는 아니지만, 시장에서 나의 가치를 확인해볼 때입니다.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    actions: [
      '업계 동향 파악',
      '원하는 회사 리스트업',
      '필요한 스킬 분석',
      '사이드 프로젝트 고려',
    ],
  },
  WAIT: {
    grade: 'WAIT',
    title: '관망',
    subtitle: '지켜보기',
    description: '아직 떠날 때는 아닙니다. 현 상황에서 개선점을 찾아보세요.',
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    actions: [
      '상사와 솔직한 대화',
      '업무 범위 재조정 요청',
      '사내 이동 가능성 탐색',
      '워라밸 개선 시도',
    ],
  },
  STAY: {
    grade: 'STAY',
    title: 'Stay',
    subtitle: '현재에 집중',
    description: '현재 직장에 대체로 만족하고 있습니다. 지금 자리에서 성장에 집중하세요.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    actions: [
      '현재 역할에서 전문성 강화',
      '사내 성장 기회 활용',
      '멘토링 참여',
      '장기 커리어 목표 설정',
    ],
  },
};

export function calculateScore(answers: Record<number, number>): number {
  const answeredQuestions = QUESTIONS.filter((q) => answers[q.id] !== undefined);
  if (answeredQuestions.length === 0) return 0;

  let totalScore = 0;
  for (const question of answeredQuestions) {
    const answer = answers[question.id];
    totalScore += question.isReversed ? 4 - answer : answer;
  }

  const maxScore = answeredQuestions.length * 4;
  return Math.round((totalScore / maxScore) * 100);
}

export function calculateCategoryScores(answers: Record<number, number>): Record<CategoryId, number> {
  const scores: Record<CategoryId, number> = {
    job: 0,
    growth: 0,
    compensation: 0,
    environment: 0,
    balance: 0,
    emotional: 0,
  };

  for (const category of CATEGORIES) {
    const categoryQuestions = QUESTIONS.filter((q) => q.category === category.id);
    const answeredQuestions = categoryQuestions.filter((q) => answers[q.id] !== undefined);

    if (answeredQuestions.length === 0) {
      scores[category.id] = 0;
      continue;
    }

    let categoryTotal = 0;
    for (const question of answeredQuestions) {
      const answer = answers[question.id];
      categoryTotal += question.isReversed ? 4 - answer : answer;
    }

    const maxCategoryScore = answeredQuestions.length * 4;
    scores[category.id] = Math.round((categoryTotal / maxCategoryScore) * 100);
  }

  return scores;
}

export function getGrade(score: number): GradeType {
  if (score >= 80) return 'LEAVE_NOW';
  if (score >= 60) return 'PREPARE';
  if (score >= 40) return 'EXPLORE';
  if (score >= 20) return 'WAIT';
  return 'STAY';
}

export function getQuizResult(answers: Record<number, number>): QuizResult {
  const score = calculateScore(answers);
  const grade = getGrade(score);
  const categoryScores = calculateCategoryScores(answers);

  return {
    score,
    grade,
    gradeInfo: GRADES[grade],
    categoryScores,
  };
}
