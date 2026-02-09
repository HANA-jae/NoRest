import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white">
              HAN
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              퇴사와 이직을 준비하는 직장인들을 위한 종합 재정 계산 도구입니다.
              <br />
              복잡한 계산은 저희에게 맡기고, 당신의 새로운 시작에 집중하세요.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">도구</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/simulator" className="hover:text-white transition-colors">
                  퇴사 시뮬레이터
                </Link>
              </li>
              <li>
                <Link to="/salary-calculator" className="hover:text-white transition-colors">
                  연봉 계산기
                </Link>
              </li>
              <li>
                <Link to="/pension-calculator" className="hover:text-white transition-colors">
                  퇴직연금 계산기
                </Link>
              </li>
              <li>
                <Link to="/job-guide" className="hover:text-white transition-colors">
                  이직 가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">정보</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  마이페이지
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {currentYear} HAN. All rights reserved.</p>
            <p className="text-xs text-neutral-500">
              본 서비스의 계산 결과는 참고용이며, 실제 금액과 다를 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
