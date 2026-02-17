export function PageLoading({ message = '불러오는 중...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="relative w-14 h-14 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-neutral-100" />
          <div className="absolute inset-0 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
        </div>
        <p className="text-neutral-500 font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}
