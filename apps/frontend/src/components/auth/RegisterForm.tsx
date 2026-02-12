import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/ui.store';

export function RegisterForm() {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const { isLoading, error } = useUiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ userId, name, email, phone, password });
    } catch {
      // Error handled in useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="reg-userId" className="block text-sm font-medium text-neutral-700 mb-1.5">
          아이디
        </label>
        <input
          id="reg-userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="사용할 아이디 입력"
          required
          minLength={2}
          maxLength={50}
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
          이름
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          required
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
          이메일
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="reg-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
          전화번호
        </label>
        <input
          id="reg-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-1234-5678"
          required
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-700 mb-1.5">
          비밀번호
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8자 이상, 대문자/숫자/특수문자 포함"
          required
          minLength={8}
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 bg-white focus:border-neutral-900 focus:ring-0 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-neutral-800 active:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? '가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
