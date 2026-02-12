export function Footer() {
  return (
    <footer className="border-t border-neutral-100 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
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
            © {new Date().getFullYear()} PickLab. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>문의하기</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
