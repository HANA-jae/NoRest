import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/auth/LoginModal';
import { ROUTES } from '@/router/routes';

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { openLoginModal } = useUiStore();
  const { logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="text-xl font-bold text-neutral-900 tracking-tight"
          >
            그만둘까
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  로그인
                </button>
                <Link
                  to={ROUTES.REGISTER}
                  className="text-sm px-5 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                >
                  시작하기
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <LoginModal />
    </>
  );
}
