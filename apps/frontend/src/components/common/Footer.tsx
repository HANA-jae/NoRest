'use client';

import { useState } from 'react';

type ModalType = 'terms' | 'privacy' | null;

const MODAL_CONTENT: Record<string, { title: string; body: string }> = {
  terms: {
    title: '이용약관',
    body: `제1조 (목적)
이 약관은 PickLab이 운영하는 "그만둘까" 서비스의 이용 조건과 절차를 규정합니다.

제2조 (서비스 내용)
본 서비스는 퇴직금 계산, 연봉 실수령액 계산, 이직 가이드 체크리스트 등을 무료로 제공합니다.

제3조 (면책 조항)
1. 본 서비스의 계산 결과는 참고용이며, 법적 효력이 없습니다.
2. 실제 금액은 관련 법령, 개인 상황에 따라 달라질 수 있습니다.
3. 중요한 의사결정 시 관련 전문가와 상담하시기 바랍니다.

제4조 (개인정보)
사용자가 입력한 정보는 계산 목적으로만 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.

제5조 (서비스 변경)
PickLab은 서비스 내용을 사전 통지 없이 변경할 수 있습니다.`,
  },
  privacy: {
    title: '개인정보처리방침',
    body: `1. 수집하는 개인정보
- 회원가입 시: 아이디, 비밀번호(암호화 저장), 이름, 이메일, 전화번호
- 서비스 이용 시: 계산 입력값, 체크리스트 진행 데이터

2. 개인정보의 이용 목적
- 서비스 제공 및 사용자 식별
- 계산 결과 저장 및 조회

3. 개인정보의 보유 및 파기
- 회원 탈퇴 시 즉시 파기합니다.
- 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.

4. 개인정보의 제3자 제공
- 별도 동의 없이 제3자에게 제공하지 않습니다.

5. 개인정보 보호 조치
- 비밀번호는 bcrypt로 암호화하여 저장합니다.
- HTTPS를 통한 데이터 전송 암호화를 적용합니다.

6. 문의
서비스 관련 문의는 picklab.dev@gmail.com으로 보내주세요.`,
  },
};

export function Footer() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <>
      <footer className="border-t border-neutral-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* 서비스 고지 */}
          <div className="text-xs text-neutral-400 leading-relaxed space-y-2 mb-6">
            <p>
              본 서비스에서 제공하는 퇴직금, 실업급여, 4대보험 등 각종 계산 결과는 참고용이며,
              실제 금액은 관련 법령 개정, 개인별 상황 및 기관 심사 결과에 따라 달라질 수 있습니다.
            </p>
            <p>
              본 서비스는 법률, 세무, 노무 등 전문 상담을 대체하지 않으며,
              중요한 의사결정 시 반드시 관련 전문가와 상담하시기 바랍니다.
            </p>
            <p>
              사용자가 입력한 정보는 계산 목적으로만 사용되며, 별도 동의 없이 제3자에게 제공되지 않습니다.
            </p>
          </div>

          {/* 하단 정보 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} PickLab. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <button
                onClick={() => setModal('terms')}
                className="hover:text-neutral-600 transition-colors"
              >
                이용약관
              </button>
              <button
                onClick={() => setModal('privacy')}
                className="hover:text-neutral-600 transition-colors"
              >
                개인정보처리방침
              </button>
              <a
                href="mailto:picklab.dev@gmail.com"
                className="hover:text-neutral-600 transition-colors"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 모달 */}
      {modal && MODAL_CONTENT[modal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900">{MODAL_CONTENT[modal].title}</h2>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <pre className="whitespace-pre-wrap text-sm text-neutral-600 leading-relaxed font-sans">
                {MODAL_CONTENT[modal].body}
              </pre>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100">
              <button
                onClick={() => setModal(null)}
                className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
