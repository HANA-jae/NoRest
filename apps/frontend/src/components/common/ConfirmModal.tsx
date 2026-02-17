'use client';

import { useEffect } from 'react';
import { useConfirmStore } from '@/store/confirm.store';
import { motion, AnimatePresence } from '@/components/motion';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'confirm-modal-title' : undefined}
        >
          <motion.div
            className="w-full max-w-sm mx-4 bg-white rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <h2 id="confirm-modal-title" className="text-lg font-bold text-neutral-900 mb-2">{title}</h2>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
