'use client';

import { useEffect, useState } from 'react';
import type { JobGuideItem } from '@/types';

interface ItemDetailModalProps {
  item: JobGuideItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNote?: (itemCode: string, note: string) => Promise<void>;
  onDeleteNote?: (itemCode: string) => Promise<void>;
  onSetTargetDate?: (itemCode: string, date: string | null) => Promise<void>;
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onSaveNote,
  onDeleteNote,
  onSetTargetDate,
}: ItemDetailModalProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setNoteText(item.note || '');
      setIsEditingNote(false);
    }
  }, [item]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditingNote) {
          handleCancelEdit();
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isEditingNote, onClose]);

  const handleSaveNote = async () => {
    if (!item || !onSaveNote) return;
    setIsSaving(true);
    try {
      await onSaveNote(item.itemCode, noteText.trim());
      setIsEditingNote(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!item || !onDeleteNote) return;
    setIsSaving(true);
    try {
      await onDeleteNote(item.itemCode);
      setNoteText('');
      setIsEditingNote(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNoteText(item?.note || '');
    setIsEditingNote(false);
  };

  if (!isOpen || !item) return null;

  const hasNote = Boolean(item.note);
  const noteChanged = noteText.trim() !== (item.note || '');
  const sectionCount = [item.description, item.tips, item.exampleContent, item.referenceLinks?.length].filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.itemTitle}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-6">
              <h2 className="text-xl font-bold mb-2 leading-tight">
                {item.itemTitle}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                {item.estimatedHours && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                    <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    약 {item.estimatedHours}시간
                  </span>
                )}
                {item.isRequired !== false && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    필수
                  </span>
                )}
                {item.itemCode.startsWith('custom_') && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    커스텀
                  </span>
                )}
              </div>
              {onSetTargetDate && (
                <div className="flex items-center gap-2 mt-3">
                  <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={item.targetDate || ''}
                    onChange={(e) =>
                      onSetTargetDate(item.itemCode, e.target.value || null)
                    }
                    className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/30 [color-scheme:dark]"
                  />
                  {item.targetDate && (
                    <button
                      onClick={() => onSetTargetDate(item.itemCode, null)}
                      className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      초기화
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors p-1 -mt-1 -mr-1"
            >
              <svg className="w-5 h-5" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {item.description && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-neutral-400" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-neutral-900">설명</h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line pl-6">
                {item.description}
              </p>
            </section>
          )}

          {item.tips && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-amber-500" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-sm font-semibold text-neutral-900">팁</h3>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl ml-6">
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {item.tips}
                </p>
              </div>
            </section>
          )}

          {item.exampleContent && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-neutral-400" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-sm font-semibold text-neutral-900">예시</h3>
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 ml-6">
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {item.exampleContent}
                </p>
              </div>
            </section>
          )}

          {item.referenceLinks && item.referenceLinks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-blue-500" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-sm font-semibold text-neutral-900">참고 자료</h3>
              </div>
              <ul className="space-y-1.5 ml-6">
                {item.referenceLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all group"
                    >
                      <svg className="w-4 h-4 shrink-0 text-blue-400 group-hover:text-blue-600" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {sectionCount === 0 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-neutral-300" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">상세 정보가 아직 없습니다.</p>
              <p className="text-neutral-300 text-xs mt-1">아래 메모에 나만의 정보를 추가해보세요.</p>
            </div>
          )}

          {/* Personal Note Section */}
          <section className="pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-sm font-semibold text-neutral-900">개인 메모</h3>
              </div>
              {!isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  {hasNote ? '수정' : '작성'}
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="이 항목에 대한 개인 메모를 작성하세요..."
                  className="w-full min-h-[100px] px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none text-sm"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={isSaving || !noteChanged}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50 text-sm"
                  >
                    취소
                  </button>
                  {hasNote && (
                    <button
                      onClick={handleDeleteNote}
                      disabled={isSaving}
                      className="ml-auto px-4 py-2 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ) : hasNote ? (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {item.note}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingNote(true)}
                className="w-full text-center py-6 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400 text-sm hover:border-neutral-300 hover:text-neutral-500 transition-all"
              >
                + 메모를 작성해보세요
              </button>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 border-t border-neutral-200 px-8 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
