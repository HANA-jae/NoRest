'use client';

import { useState, useEffect } from 'react';

interface PhaseNoteSectionProps {
  templateId: number;
  phaseNoteId?: number;
  phaseNote?: string;
  onSave: (templateId: number, noteId: number | undefined, content: string) => Promise<void>;
  onDelete: (noteId: number) => Promise<void>;
}

export function PhaseNoteSection({
  templateId,
  phaseNoteId,
  phaseNote,
  onSave,
  onDelete,
}: PhaseNoteSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(phaseNote || '');
  const [isSaving, setIsSaving] = useState(false);

  // 서버에서 갱신된 데이터가 props로 내려오면 로컬 상태 동기화
  useEffect(() => {
    if (!isEditing) {
      setNoteText(phaseNote || '');
    }
  }, [phaseNote, isEditing]);

  const hasNote = Boolean(phaseNote);
  const noteChanged = noteText.trim() !== (phaseNote || '');

  const handleSave = async () => {
    if (!noteText.trim()) return;
    setIsSaving(true);
    try {
      await onSave(templateId, phaseNoteId, noteText.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!phaseNoteId) return;
    setIsSaving(true);
    try {
      await onDelete(phaseNoteId);
      setNoteText('');
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNoteText(phaseNote || '');
    setIsEditing(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>단계 메모</span>
        {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      </button>

      {isOpen && (
        <div className="mt-3 pl-5">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="이 단계에 대한 메모를 작성하세요..."
                className="w-full min-h-[80px] px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none text-sm"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !noteChanged || !noteText.trim()}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50 text-xs"
                >
                  취소
                </button>
                {hasNote && (
                  <button
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="ml-auto px-3 py-1.5 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 text-xs"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ) : hasNote ? (
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm text-neutral-600 leading-relaxed whitespace-pre-line bg-neutral-50 px-4 py-3 rounded-lg">
                {phaseNote}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors shrink-0 pt-3"
              >
                수정
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              + 메모 작성
            </button>
          )}
        </div>
      )}
    </div>
  );
}
