export function PageError({
  message = '데이터를 불러올 수 없습니다',
  detail,
  onRetry,
}: {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-neutral-900 font-medium mb-1.5">{message}</p>
        {detail && <p className="text-neutral-400 text-sm mb-5">{detail}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
