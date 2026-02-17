'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // 이직 준비
  {
    category: '이직 준비',
    question: '이직 준비는 얼마나 걸리나요?',
    answer:
      '일반적으로 2~6개월이 소요됩니다. 현재 시장 상황, 목표 포지션, 준비 정도에 따라 달라집니다. 평균적으로 이력서 준비 1~2주, 탐색 및 지원 2~4주, 면접 과정 2~6주, 협상 및 퇴사 절차 2~4주 정도를 예상하세요.',
  },
  {
    category: '이직 준비',
    question: '현 직장에 다니면서 이직 준비를 해도 되나요?',
    answer:
      '네, 대부분의 사람들이 재직 중에 이직 준비를 합니다. 다만 주의사항이 있습니다: (1) 회사 장비로 이력서를 작성하지 마세요, (2) 근무 시간에 면접을 잡을 때는 반차/연차를 활용하세요, (3) 동료에게 이직 의사를 미리 알리지 않는 것이 좋습니다, (4) 경업금지 조항이 있는지 확인하세요.',
  },
  {
    category: '이직 준비',
    question: '이직에 적합한 시기가 있나요?',
    answer:
      '일반적으로 1~3월(연초 채용 시즌), 9~10월(하반기 채용 시즌)이 채용 공고가 많습니다. 하지만 IT 업계는 연중 상시 채용이 많으므로 특정 시기에 집착하기보다는, 본인의 성과급 지급일, 스톡옵션 베스팅, 프로젝트 마일스톤을 고려하여 타이밍을 잡는 것이 더 중요합니다.',
  },
  {
    category: '이직 준비',
    question: '경력 기간이 짧아도 이직할 수 있나요?',
    answer:
      '가능하지만 전략이 필요합니다. 1년 미만이면 "잦은 이직"으로 보일 수 있으므로, 이직 사유를 명확히 준비해야 합니다. 좋은 사유: 프로젝트 종료, 회사 구조조정, 명확한 커리어 방향 전환 등. 가급적 최소 1년 이상 근무 후 이직하는 것을 권장합니다.',
  },
  // 이력서/면접
  {
    category: '이력서/면접',
    question: '이력서에 꼭 들어가야 할 내용은?',
    answer:
      '핵심 필수 항목: (1) 경력 사항 - 최신순으로, 회사명/기간/직급/주요 업무, (2) 정량적 성과 - 수치로 표현 가능한 성과 3~5개, (3) 기술 스택 - 실제 사용 경험 있는 기술만, (4) 학력 - 간략히, (5) 자격증/수상 - 관련된 것만. 블로그, GitHub, 포트폴리오 링크도 포함하면 좋습니다.',
  },
  {
    category: '이력서/면접',
    question: '면접에서 "이직 사유"를 어떻게 답해야 하나요?',
    answer:
      '핵심은 "성장"에 포커스를 맞추는 것입니다. 좋은 예: "현재 역할에서 많은 것을 배웠지만, 더 큰 규모의 시스템을 다루며 성장하고 싶습니다." 나쁜 예: "현 회사 상사가 마음에 안 들어서요." 현 회사를 비판하지 말고, 지원 회사에서 얻고 싶은 것을 중심으로 답하세요.',
  },
  {
    category: '이력서/면접',
    question: '코딩 테스트는 어떻게 준비하나요?',
    answer:
      '추천 학습 순서: (1) 자료구조 기초(배열, 해시, 스택, 큐, 트리) 복습, (2) 주요 알고리즘 패턴(투 포인터, 슬라이딩 윈도우, BFS/DFS, DP) 학습, (3) 프로그래머스/LeetCode에서 하루 1~2문제씩 풀기, (4) 실전처럼 시간 제한 두고 연습. 최소 2~4주간 꾸준히 하는 것이 중요합니다.',
  },
  {
    category: '이력서/면접',
    question: '포트폴리오는 어떻게 만들어야 하나요?',
    answer:
      '효과적인 포트폴리오의 핵심: (1) 프로젝트 3~5개를 선별 - 양보다 질, (2) 각 프로젝트별 문제-해결-결과 구조로 정리, (3) 본인의 역할과 기여도를 명확히, (4) 기술적 의사결정 배경 서술, (5) 라이브 데모나 스크린샷 포함. Notion, GitHub Pages, 개인 웹사이트 등으로 구축하세요.',
  },
  // 연봉/협상
  {
    category: '연봉/협상',
    question: '연봉 협상을 할 때 주의할 점은?',
    answer:
      '(1) 먼저 숫자를 제시하지 마세요 - 회사 제안을 먼저 받으세요, (2) 시장 데이터로 근거를 제시하세요, (3) 기본급 외에 사이닝 보너스, 스톡옵션, 복리후생도 협상 가능합니다, (4) 감정적이지 않게, 프로페셔널하게 대화하세요, (5) 최소 수용 가능 연봉을 미리 정해두세요, (6) 서면으로 확인 받으세요.',
  },
  {
    category: '연봉/협상',
    question: '복수 오퍼를 받으면 어떻게 하나요?',
    answer:
      '축하합니다! (1) 각 오퍼를 연봉, 복리후생, 성장 가능성, 워라밸, 회사 문화 등의 기준으로 비교 표를 만드세요, (2) 선호도가 높은 회사에 다른 오퍼가 있음을 알릴 수 있습니다(압박이 아닌 정보 공유), (3) 결정 기한을 합리적으로 요청하세요(보통 1~2주), (4) 거절하는 회사에도 정중하게 알려주세요.',
  },
  {
    category: '연봉/협상',
    question: '희망 연봉을 물으면 어떻게 답해야 하나요?',
    answer:
      '가능하면 먼저 숫자를 말하지 않는 것이 유리합니다. "현재 시장 수준과 제 경력을 고려하여 적절한 제안을 주시면 검토하겠습니다"라고 답할 수 있습니다. 불가피하게 말해야 한다면, 현재 연봉 대비 15~30% 인상된 범위를 제시하되, "총 보상 패키지를 종합적으로 고려하겠습니다"라고 덧붙이세요.',
  },
  // 퇴사/이직
  {
    category: '퇴사/이직',
    question: '퇴사 통보는 언제 해야 하나요?',
    answer:
      '법적으로는 30일 전 통보가 원칙입니다(근로기준법). 하지만 실무적으로는: (1) 인수인계를 고려하여 45~60일 전이 이상적, (2) 중요 프로젝트 마감 직후가 좋은 타이밍, (3) 성과급/보너스 지급일 이후가 유리, (4) 직속 상사에게 먼저 구두로 알린 후 인사팀에 공식 문서를 제출하세요.',
  },
  {
    category: '퇴사/이직',
    question: '퇴직금은 어떻게 계산되나요?',
    answer:
      '퇴직금 = 1일 평균 임금 × 30일 × (근속 연수). 여기서 1일 평균 임금은 퇴직 전 3개월간의 총 급여를 해당 기간의 총 일수로 나눈 금액입니다. 총 급여에는 기본급, 식대, 교통비, 상여금의 일부가 포함됩니다. 고용노동부 퇴직금 계산기로 미리 확인하세요.',
  },
  {
    category: '퇴사/이직',
    question: '퇴사 후 4대보험은 어떻게 되나요?',
    answer:
      '(1) 국민연금: 납부 예외 신청 가능(소득 없는 기간), (2) 건강보험: 임의계속가입(퇴사 후 36개월간 직장 보험료로 유지 가능) 또는 지역가입자 전환, (3) 고용보험: 실업급여 수급 가능(자발적 퇴사도 일부 사유 인정), (4) 산재보험: 퇴사 시 자동 상실. 다음 회사 입사 시 자동으로 재가입됩니다.',
  },
  {
    category: '퇴사/이직',
    question: '인수인계를 잘하는 방법은?',
    answer:
      '좋은 인수인계의 핵심: (1) 업무 목록과 진행 현황 문서화, (2) 주요 관계자(거래처, 유관 부서) 연락처 정리, (3) 시스템 접근 권한 및 계정 정보 인계, (4) 반복 업무의 상세 프로세스 매뉴얼 작성, (5) 진행 중인 이슈와 주의사항 공유, (6) 후임자와 최소 1~2주 겹치는 기간 확보. 마지막 인상이 커리어에 중요합니다.',
  },
];

const CATEGORIES = [...new Set(FAQ_DATA.map((f) => f.category))];

const CATEGORY_ICONS: Record<string, string> = {
  '이직 준비': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  '이력서/면접': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  '연봉/협상': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  '퇴사/이직': 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);

  const filtered = FAQ_DATA.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <svg className="w-5 h-5 text-neutral-400" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">자주 묻는 질문</h2>
          <p className="text-xs text-neutral-400">이직 과정에서 가장 많이 궁금해하는 질문들</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const iconPath = CATEGORY_ICONS[cat] || '';
          const count = FAQ_DATA.filter((f) => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/15'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <svg className={`w-4 h-4 ${activeCategory === cat ? 'text-neutral-400' : 'text-neutral-400'}`} fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
              </svg>
              <span>{cat}</span>
              <span className={`text-xs ${activeCategory === cat ? 'text-neutral-400' : 'text-neutral-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-2">
        {filtered.map((faq, i) => {
          const globalIndex = FAQ_DATA.indexOf(faq);
          const isOpen = openIndex === globalIndex;

          return (
            <div
              key={globalIndex}
              className={`border rounded-xl overflow-hidden transition-all ${
                isOpen ? 'border-neutral-300 shadow-sm' : 'border-neutral-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                  isOpen ? 'bg-neutral-50' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3 pr-4">
                  <span className={`text-xs font-bold tabular-nums w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isOpen ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {i + 1}
                  </span>
                  <span className={`text-sm font-medium ${isOpen ? 'text-neutral-900' : 'text-neutral-700'}`}>
                    {faq.question}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1">
                  <div className="pl-9">
                    <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom tip */}
      <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 rounded-xl px-5 py-3.5">
        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-xs text-neutral-500">
          더 궁금한 점이 있으시면 체크리스트 항목의 상세 정보와 참고 자료를 확인해보세요.
        </p>
      </div>
    </div>
  );
}
