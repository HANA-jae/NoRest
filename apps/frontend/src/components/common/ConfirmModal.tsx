import { useEffect } from 'react';
import { useConfirmStore } from '@/store/confirm.store';

export function ConfirmModal() {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    handleConfirm,
    handleCancel,
  } = useConfirmStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm modal-backdrop-enter"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-sm mx-4 bg-white rounded-2xl p-6 modal-content-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-lg font-bold text-neutral-900 mb-2">{title}</h2>
        )}
        <p className="text-neutral-500 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border border-neutral-200 text-neutral-600 rounded-lg font-medium text-sm hover:bg-neutral-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
