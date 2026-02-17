'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quiz.store';
import { useConfirm } from '@/store/confirm.store';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface QuizLayoutProps {
  children: ReactNode;
}

export function QuizLayout({ children }: QuizLayoutProps) {
  const { phase, reset } = useQuizStore();
  const { confirm } = useConfirm();
  const router = useRouter();

  const handleExit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (phase === 'questions') {
      const confirmed = await confirm({
        title: '테스트 종료',
        message: '테스트를 종료하시겠습니까? 진행 상황이 사라집니다.',
        confirmText: '종료',
        variant: 'danger',
      });
      if (confirmed) {
        reset();
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            onClick={handleExit}
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            ← 나가기
          </Link>
          <span className="text-sm font-medium text-neutral-900">퇴사각 테스트</span>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
      <ConfirmModal />
    </div>
  );
}
