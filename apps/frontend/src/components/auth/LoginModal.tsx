'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/ui.store';

export function LoginModal() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { isLoading, error, isLoginModalOpen, closeLoginModal } = useUiStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLoginModal();
    };
    if (isLoginModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isLoginModalOpen, closeLoginModal]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ userId, password });
    } catch {
      // error handled in useAuth
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeLoginModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-neutral-900">로그인</h2>
          <button
            onClick={closeLoginModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-userId" className="block text-sm font-medium text-neutral-700 mb-1.5">
              아이디
            </label>
            <input
              id="login-userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디 입력"
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 mb-1.5">
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-neutral-800 active:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          계정이 없으신가요?{' '}
          <Link
            href="/register"
            onClick={closeLoginModal}
            className="text-neutral-900 font-medium hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
