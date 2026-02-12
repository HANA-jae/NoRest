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

  const hasChanges =
    name !== user.name || email !== user.email || phone !== user.phone;

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            placeholder="이름을 입력하세요"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            placeholder="이메일을 입력하세요"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            전화번호
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            placeholder="010-0000-0000"
          />
        </div>

        {/* Buttons */}
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
    </div>
  );
}
