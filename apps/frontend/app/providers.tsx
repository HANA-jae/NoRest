'use client';

import { useEffect, useState } from 'react';
import { ToastContainer } from '@/components/common/Toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useAuthStore } from '@/store/auth.store';
import { useHistoryStore } from '@/store/history.store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Rehydrate persisted stores
    useAuthStore.persist.rehydrate();
    useHistoryStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {children}
      <ToastContainer />
      <ConfirmModal />
    </>
  );
}
