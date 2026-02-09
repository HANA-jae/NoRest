import { useEffect, useState } from 'react';
import { useToastStore, Toast as ToastType } from '../../store/toast.store';

const toastIcons: Record<ToastType['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

const toastStyles: Record<ToastType['type'], string> = {
  success: 'bg-success-50 border-success-500 text-success-600',
  error: 'bg-danger-50 border-danger-500 text-danger-600',
  warning: 'bg-warning-50 border-warning-500 text-warning-600',
  info: 'bg-brand-50 border-brand-500 text-brand-600',
};

const iconStyles: Record<ToastType['type'], string> = {
  success: 'bg-success-500',
  error: 'bg-danger-500',
  warning: 'bg-warning-500',
  info: 'bg-brand-500',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const [isExiting, setIsExiting] = useState(false);
  const removeToast = useToastStore((state) => state.removeToast);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg
        ${toastStyles[toast.type]}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
    >
      <span
        className={`
          flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold
          ${iconStyles[toast.type]}
        `}
      >
        {toastIcons[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
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
