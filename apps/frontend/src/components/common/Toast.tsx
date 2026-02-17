'use client';

import { useToastStore, Toast as ToastType } from '../../store/toast.store';
import { motion, AnimatePresence } from '@/components/motion';

const toastStyles: Record<ToastType['type'], string> = {
  success: 'bg-neutral-900 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-neutral-900 text-white',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToastStore((state) => state.removeToast);

  const handleClose = () => {
    removeToast(toast.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
      }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        ${toastStyles[toast.type]}
      `}
    >
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-white/60 hover:text-white text-sm"
      >
        ×
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const { success, error, warning, info } = useToastStore();
  return { success, error, warning, info };
}
