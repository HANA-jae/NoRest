import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useUiStore } from '@/store/ui.store';
import { ROUTES } from '@/router/routes';

export function RegisterPage() {
  const navigate = useNavigate();
  const { openLoginModal } = useUiStore();

  const handleLoginClick = () => {
    navigate(ROUTES.HOME);
    openLoginModal();
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">회원가입</h2>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-neutral-400">
        이미 계정이 있으신가요?{' '}
        <button
          onClick={handleLoginClick}
          className="text-neutral-900 font-medium hover:underline"
        >
          로그인
        </button>
      </p>
    </div>
  );
}
