import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <Link to={ROUTES.HOME} className="text-lg font-bold text-neutral-900">
              HAN
            </Link>
            <p className="text-sm text-neutral-500 mt-2 max-w-xs">
              직장인을 위한 재정 계산 도구
            </p>
          </div>

          <div className="flex gap-8">
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-3">도구</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li>
                  <Link to={ROUTES.SIMULATOR} className="hover:text-neutral-900">
                    퇴사 시뮬레이터
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.SALARY_CALCULATOR} className="hover:text-neutral-900">
                    연봉 계산기
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.PENSION_CALCULATOR} className="hover:text-neutral-900">
                    퇴직연금 계산기
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.JOB_GUIDE} className="hover:text-neutral-900">
                    이직 가이드
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col md:flex-row justify-between gap-4 text-xs text-neutral-400">
          <p>© {currentYear} HAN. All rights reserved.</p>
          <p>본 서비스의 계산 결과는 참고용이며, 실제 금액과 다를 수 있습니다.</p>
        </div>
      </div>
    </footer>
  );
}
