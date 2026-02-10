'use client';

import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useUiStore } from '@/store/ui.store';

export default function RegisterPage() {
  const router = useRouter();
  const { openLoginModal } = useUiStore();

  const handleLoginClick = () => {
    router.push('/');
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
