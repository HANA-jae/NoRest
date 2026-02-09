import { useState } from 'react';
import { useToastStore, Toast as ToastType } from '../../store/toast.store';

const toastStyles: Record<ToastType['type'], string> = {
  success: 'bg-neutral-900 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-neutral-900 text-white',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const [isExiting, setIsExiting] = useState(false);
  const removeToast = useToastStore((state) => state.removeToast);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 200);
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        ${toastStyles[toast.type]}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
    >
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-white/60 hover:text-white text-sm"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export function useToast() {
  const { success, error, warning, info } = useToastStore();
  return { success, error, warning, info };
}
