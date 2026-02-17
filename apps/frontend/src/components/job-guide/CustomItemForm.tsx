'use client';

import { useState } from 'react';
import type { CreateCustomItemPayload } from '@/types';

interface CustomItemFormProps {
  templateId: number;
  nextOrder: number;
  onSave: (payload: CreateCustomItemPayload) => Promise<boolean>;
  onCancel: () => void;
}

export function CustomItemForm({
  templateId,
  nextOrder,
  onSave,
  onCancel,
}: CustomItemFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const success = await onSave({
        templateId,
        itemTitle: title.trim(),
        description: description.trim() || undefined,
        itemOrder: nextOrder,
        targetDate: targetDate || undefined,
      });
      if (success) {
        onCancel();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="항목 제목을 입력하세요"
        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && title.trim()) handleSubmit();
          if (e.key === 'Escape') onCancel();
        }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명 (선택)"
        rows={2}
        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none bg-white"
      />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">목표일</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="px-2 py-1 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white"
          />
        </div>
        <div className="flex-1" />
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving || !title.trim()}
          className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? '저장 중...' : '추가'}
        </button>
      </div>
    </div>
  );
}
