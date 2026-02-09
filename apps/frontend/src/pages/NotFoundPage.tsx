import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <p className="text-8xl font-bold text-neutral-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-neutral-900 mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-neutral-500 mb-8 text-center">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className="flex gap-3">
        <Link
          to={ROUTES.HOME}
          className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800"
        >
          홈으로
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 text-neutral-600 text-sm font-medium hover:text-neutral-900"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}
