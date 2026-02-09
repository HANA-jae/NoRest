import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <Link to={ROUTES.HOME} className="font-semibold text-neutral-900">
            그만둘까
          </Link>
          <nav className="flex items-center gap-6 text-neutral-500">
            <Link to={ROUTES.SIMULATOR} className="hover:text-neutral-900 transition-colors">
              시뮬레이터
            </Link>
            <Link to={ROUTES.RESIGNATION_QUIZ} className="hover:text-neutral-900 transition-colors">
              퇴사각
            </Link>
            <Link to={ROUTES.SALARY_CALCULATOR} className="hover:text-neutral-900 transition-colors">
              연봉
            </Link>
            <Link to={ROUTES.PENSION_CALCULATOR} className="hover:text-neutral-900 transition-colors">
              연금
            </Link>
            <Link to={ROUTES.JOB_GUIDE} className="hover:text-neutral-900 transition-colors">
              가이드
            </Link>
          </nav>
          <p className="text-neutral-400 text-xs">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
