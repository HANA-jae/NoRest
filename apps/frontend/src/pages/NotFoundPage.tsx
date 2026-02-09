import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 page-enter">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="text-[180px] md:text-[240px] font-bold text-neutral-100 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl md:text-8xl animate-bounce">🔍</div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            <span>←</span>
            홈으로 돌아가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-300 transition-colors"
          >
            이전 페이지
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brand-100 rounded-full opacity-50 blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-100 rounded-full opacity-50 blur-2xl" />
    </div>
  );
}
