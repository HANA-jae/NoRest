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
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="text-lg font-bold text-neutral-900 tracking-tight no-underline">
            HAN
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-neutral-500">{user?.name}</span>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-sm text-neutral-600 hover:text-neutral-900 no-underline transition-colors"
                >
                  대시보드
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
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
                  className="text-sm px-4 py-1.5 bg-neutral-900 text-white rounded-lg no-underline hover:bg-neutral-800 transition-colors"
                >
                  회원가입
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
