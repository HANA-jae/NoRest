'use client';

import { useState, useEffect, useMemo } from 'react';
import { jobGuideService } from '@/services/job-guide.service';
import type { TemplateDownload } from '@/types';

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  '이력서': {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    color: 'text-blue-500',
  },
  '면접': {
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    color: 'text-amber-500',
  },
  '협상': {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'text-green-500',
  },
  '체크리스트': {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    color: 'text-purple-500',
  },
};

const FILE_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  DOCX: { bg: 'bg-blue-50', text: 'text-blue-600' },
  PDF: { bg: 'bg-red-50', text: 'text-red-600' },
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function DownloadsSection() {
  const [templates, setTemplates] = useState<TemplateDownload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await jobGuideService.getTemplateDownloads();
      if (data) setTemplates(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<string, TemplateDownload[]>();
    templates.forEach((t) => {
      const existing = groups.get(t.category) || [];
      existing.push(t);
      groups.set(t.category, existing);
    });
    return groups;
  }, [templates]);

  const handleDownload = async (templateKey: string) => {
    setDownloadingKey(templateKey);
    const success = await jobGuideService.recordDownload(templateKey);
    if (success) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.templateKey === templateKey
            ? { ...t, downloadCount: t.downloadCount + 1 }
            : t,
        ),
      );
    }
    setDownloadingKey(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-neutral-100" />
          <div className="absolute inset-0 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
        </div>
        <p className="text-neutral-400 text-sm">템플릿을 불러오는 중...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-300" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-neutral-500 font-medium mb-1">다운로드 가능한 템플릿이 없습니다</p>
        <p className="text-neutral-400 text-sm">곧 유용한 템플릿이 추가될 예정입니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-neutral-400" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">템플릿 다운로드</h2>
          <p className="text-xs text-neutral-400">이직 준비에 도움이 되는 문서 템플릿</p>
        </div>
      </div>

      {Array.from(grouped.entries()).map(([category, items]) => {
        const meta = CATEGORY_META[category] || { icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'text-neutral-500' };
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <svg className={`w-4 h-4 ${meta.color}`} fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
              </svg>
              <h3 className="text-sm font-bold text-neutral-900">{category}</h3>
              <span className="text-xs text-neutral-300">{items.length}개</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((template) => {
                const fileStyle = FILE_TYPE_STYLES[template.templateType] || { bg: 'bg-neutral-50', text: 'text-neutral-600' };
                return (
                  <div
                    key={template.templateKey}
                    className="group flex gap-4 p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all bg-white"
                  >
                    <div className={`w-10 h-10 rounded-lg ${fileStyle.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${fileStyle.text}`}>{template.templateType}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-900 leading-tight mb-1">
                        {template.templateName}
                      </h4>
                      {template.description && (
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
                          {template.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                          {template.fileSize && (
                            <span>{formatFileSize(template.fileSize)}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {template.downloadCount.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownload(template.templateKey)}
                          disabled={downloadingKey === template.templateKey}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                        >
                          {downloadingKey === template.templateKey ? (
                            <>
                              <span className="inline-block animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
                              <span>다운로드 중</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span>다운로드</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
