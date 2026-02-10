import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-8xl font-bold text-neutral-200 mb-6">404</p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-neutral-500 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
        >
          <span>←</span>
          <span>홈으로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
}
