import { create } from 'zustand';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'default' | 'danger';
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;

  show: (options: ConfirmOptions & { onConfirm?: () => void; onCancel?: () => void }) => void;
  hide: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  variant: 'default',
  onConfirm: null,
  onCancel: null,

  show: (options) => {
    set({
      isOpen: true,
      title: options.title || '',
      message: options.message,
      confirmText: options.confirmText || '확인',
      cancelText: options.cancelText || '취소',
      variant: options.variant || 'default',
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
    });
  },

  hide: () => {
    set({
      isOpen: false,
      onConfirm: null,
      onCancel: null,
    });
  },

  handleConfirm: () => {
    const { onConfirm } = get();
    if (onConfirm) onConfirm();
    get().hide();
  },

  handleCancel: () => {
    const { onCancel } = get();
    if (onCancel) onCancel();
    get().hide();
  },
}));

export function useConfirm() {
  const show = useConfirmStore((s) => s.show);

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      show({
        ...options,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  return { confirm };
}
