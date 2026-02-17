'use client';

import { useState } from 'react';
import type { CreateCustomItemPayload } from '@/types';

interface PresetItem {
  title: string;
  description: string;
}

const PHASE_PRESETS: Record<string, PresetItem[]> = {
  preparation: [
    { title: '현재 연봉 명세서 확인', description: '세전/세후 연봉, 성과급, 복리후생 금액을 정확히 파악합니다' },
    { title: '경력 개발 계획 수립', description: '향후 3~5년간의 커리어 방향과 필요 역량을 정리합니다' },
    { title: '이직 타임라인 작성', description: '준비부터 입사까지의 전체 일정을 캘린더에 표시합니다' },
    { title: '현 직장 장단점 분석', description: '현재 직장의 장단점을 객관적으로 정리하여 이직 기준으로 활용합니다' },
    { title: '원하는 회사 유형 정리', description: '스타트업/중견/대기업, 원격근무 등 원하는 회사 조건을 리스트업합니다' },
    { title: '비상금 확보 계획', description: '이직 기간 동안 생활비 3~6개월분의 비상금을 확보합니다' },
    { title: '멘토/선배 상담', description: '같은 업계 선배에게 이직 조언을 구합니다' },
  ],
  resume: [
    { title: '프로젝트 경험 상세 정리', description: '각 프로젝트의 역할, 기술 스택, 성과를 구체적으로 문서화합니다' },
    { title: '기술 블로그 글 작성', description: '최근 기술 경험이나 문제 해결 과정을 블로그에 정리합니다' },
    { title: 'GitHub 프로필 정리', description: 'Pinned Repos, README, 커밋 그래프를 정돈합니다' },
    { title: '이력서 피드백 받기', description: '동료, 선배, 멘토에게 이력서 리뷰를 요청합니다' },
    { title: '영문 이력서 준비', description: '외국계/글로벌 기업 지원을 위한 영문 이력서를 작성합니다' },
    { title: '성과 수치화 정리', description: '프로젝트 성과를 정량적 데이터(%, 건수, 매출)로 변환합니다' },
    { title: '링크드인 프로필 업데이트', description: '링크드인 프로필을 최신 경력으로 업데이트하고 키워드를 최적화합니다' },
  ],
  search: [
    { title: '기술 커뮤니티 활동', description: '관련 기술 커뮤니티에 참여하여 네트워크를 확장합니다' },
    { title: '오프라인 밋업 참석', description: '개발자 밋업, 컨퍼런스에 참석하여 정보를 수집합니다' },
    { title: '관심 회사 뉴스 모니터링', description: '목표 회사의 최신 뉴스, 채용 소식을 추적합니다' },
    { title: '회사별 면접 후기 조사', description: '면접 후기 사이트에서 목표 회사의 면접 프로세스를 파악합니다' },
    { title: '채용 설명회 참석', description: '관심 회사의 채용 설명회나 오픈 세미나에 참석합니다' },
    { title: '헤드헌터 컨택', description: '신뢰할 수 있는 헤드헌터 2~3명에게 이직 의향을 전달합니다' },
    { title: '타겟 기업 리스트업', description: '지원할 기업 10~15개를 선정하고 우선순위를 정합니다' },
  ],
  interview: [
    { title: '시스템 설계 면접 준비', description: '대규모 시스템 설계 질문에 대한 답변을 연습합니다' },
    { title: '행동 면접(BQ) 연습', description: 'STAR 기법을 활용한 행동 질문 답변을 준비합니다' },
    { title: '포트폴리오 발표 준비', description: '주요 프로젝트를 5~10분 내로 발표하는 연습을 합니다' },
    { title: '화상 면접 환경 세팅', description: '조명, 배경, 마이크, 카메라 등 화상 면접 환경을 점검합니다' },
    { title: '면접 답변 녹음 연습', description: '자기소개, 이직 사유 등 핵심 답변을 녹음하며 연습합니다' },
    { title: '역질문 리스트 준비', description: '면접관에게 물을 질문 5~10개를 미리 준비합니다' },
    { title: '면접 복장 준비', description: '회사 문화에 맞는 면접 복장을 미리 준비하고 점검합니다' },
  ],
  negotiation: [
    { title: '현재 복리후생 목록 정리', description: '현 직장의 복리후생을 정리하여 비교 기준으로 활용합니다' },
    { title: '스톡옵션/RSU 조건 분석', description: '제안받은 스톡옵션의 베스팅, 행사가 등 조건을 분석합니다' },
    { title: '동종업계 연봉 정보 수집', description: '지인, 커뮤니티를 통해 실제 연봉 데이터를 수집합니다' },
    { title: '협상 시나리오 리허설', description: '예상 제안에 대한 카운터 제안 시나리오를 연습합니다' },
    { title: '입사 전 체크리스트 작성', description: '입사 전 준비할 서류, 물품, 학습 내용을 정리합니다' },
    { title: '근로계약서 검토 포인트 정리', description: '급여, 수습기간, 경업금지 조항 등 핵심 조항을 체크합니다' },
    { title: '복수 오퍼 비교표 작성', description: '받은 오퍼들의 연봉, 복지, 성장성을 비교 표로 정리합니다' },
  ],
  resignation: [
    { title: '개인 파일/자료 정리', description: '회사 장비에 있는 개인 자료를 백업하고 정리합니다' },
    { title: '업무 매뉴얼 작성', description: '후임자를 위한 상세 업무 매뉴얼을 문서화합니다' },
    { title: '팀 회식/식사 계획', description: '함께 일한 동료들과 마지막 식사 일정을 계획합니다' },
    { title: '퇴사 후 건강검진 예약', description: '이직 기간 동안 건강검진을 받을 수 있도록 예약합니다' },
    { title: '경력증명서 발급', description: '인사팀에 경력증명서, 재직증명서 발급을 요청합니다' },
    { title: '퇴직연금 처리 확인', description: 'DC형/DB형 퇴직연금 이전 절차를 확인합니다' },
    { title: '동료 연락처 정리', description: '지속적으로 연락할 동료들의 개인 연락처를 확보합니다' },
  ],
};

interface CustomItemPresetsProps {
  phaseId: string;
  templateId: number;
  nextOrder: number;
  existingTitles: string[];
  onAdd: (payload: CreateCustomItemPayload) => Promise<boolean>;
}

export function CustomItemPresets({
  phaseId,
  templateId,
  nextOrder,
  existingTitles,
  onAdd,
}: CustomItemPresetsProps) {
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const presets = PHASE_PRESETS[phaseId] || [];
  const available = presets.filter(
    (p) => !existingTitles.includes(p.title),
  );

  if (available.length === 0) return null;

  const displayItems = expanded ? available : available.slice(0, 4);

  const handleAdd = async (preset: PresetItem, index: number) => {
    setAddingIndex(index);
    await onAdd({
      templateId,
      itemTitle: preset.title,
      description: preset.description,
      itemOrder: nextOrder,
    });
    setAddingIndex(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400 font-medium">추천 항목</p>
        <span className="text-[10px] text-neutral-300">{available.length}개 추가 가능</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayItems.map((preset, i) => (
          <button
            key={preset.title}
            onClick={() => handleAdd(preset, i)}
            disabled={addingIndex !== null}
            className="group relative flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 text-xs text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={preset.description}
          >
            <svg className="w-3 h-3 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>{preset.title}</span>
            {addingIndex === i && (
              <span className="inline-block animate-spin w-3 h-3 border border-neutral-400 border-t-transparent rounded-full ml-1" />
            )}
          </button>
        ))}
      </div>
      {!expanded && available.length > 4 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          + {available.length - 4}개 더 보기
        </button>
      )}
      {expanded && available.length > 4 && (
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          접기
        </button>
      )}
    </div>
  );
}
