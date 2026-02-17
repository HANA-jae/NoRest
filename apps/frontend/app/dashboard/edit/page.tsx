'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useToastStore } from '@/store/toast.store';
import { userService } from '@/services/user.service';

export default function ProfileEditPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [isPwSaving, setIsPwSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      useToastStore.getState().error('이름은 2자 이상이어야 합니다.');
      return;
    }

    if (!email.trim()) {
      useToastStore.getState().error('이메일을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setUser(updated);
      useToastStore.getState().success('정보가 수정되었습니다.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '저장에 실패했습니다.';
      useToastStore.getState().error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPw) {
      useToastStore.getState().error('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (newPw.length < 4) {
      useToastStore.getState().error('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (newPw !== confirmPw) {
      useToastStore.getState().error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsPwSaving(true);
    try {
      await userService.changePassword(currentPw, newPw);
      useToastStore.getState().success('비밀번호가 변경되었습니다.');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.';
      useToastStore.getState().error(message);
    } finally {
      setIsPwSaving(false);
    }
  };

  const hasChanges =
    name !== user.name || email !== user.email || phone !== user.phone;

  const inputClass =
    'w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <Link
          href="/dashboard"
          className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          ← 대시보드
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-4">정보 수정</h1>
        <p className="text-neutral-500 text-sm mt-1">
          아이디: {user.id}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="이름을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
            전화번호
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="010-0000-0000"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="flex-1 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors text-center"
          >
            취소
          </Link>
        </div>
      </form>

      {/* Password Change */}
      <div className="mt-12 pt-8 border-t border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-1">비밀번호 변경</h2>
        <p className="text-sm text-neutral-400 mb-6">보안을 위해 주기적으로 변경해주세요</p>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPw" className="block text-sm font-medium text-neutral-700 mb-2">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                id="currentPw"
                type={showPw ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={inputClass}
                placeholder="현재 비밀번호"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                tabIndex={-1}
              >
                {showPw ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPw" className="block text-sm font-medium text-neutral-700 mb-2">
              새 비밀번호
            </label>
            <input
              id="newPw"
              type={showPw ? 'text' : 'password'}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className={inputClass}
              placeholder="새 비밀번호 (4자 이상)"
            />
          </div>

          <div>
            <label htmlFor="confirmPw" className="block text-sm font-medium text-neutral-700 mb-2">
              새 비밀번호 확인
            </label>
            <input
              id="confirmPw"
              type={showPw ? 'text' : 'password'}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={inputClass}
              placeholder="새 비밀번호 확인"
            />
            {confirmPw && newPw !== confirmPw && (
              <p className="text-xs text-red-500 mt-1.5">비밀번호가 일치하지 않습니다</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPwSaving || !currentPw || !newPw || newPw !== confirmPw}
            className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {isPwSaving ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  );
}
