'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/auth/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerItem } from '@/components/motion';

const NAV_LINKS = [
  { href: '/job-guide', label: '이직가이드' },
  { href: '/salary-calculator', label: '연봉계산기' },
  { href: '/pension-calculator', label: '퇴직금계산기' },
  { href: '/resignation-quiz', label: '퇴사각테스트' },
  { href: '/simulator', label: '시뮬레이터' },
];

const staggerNavVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { openLoginModal } = useUiStore();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            {/* 로고 */}
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight shrink-0"
            >
              그만둘까
            </Link>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? 'text-neutral-900 bg-neutral-100 font-medium'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* 데스크톱 인증 영역 */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {user?.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    로그인
                  </button>
                  <Link
                    href="/register"
                    className="text-sm px-4 py-1.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    시작하기
                  </Link>
                </>
              )}
            </div>

            {/* 모바일 햄버거 버튼 */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </header>
      </motion.div>

      {/* 모바일 드로어 오버레이 */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* 배경 dim */}
            <motion.div
              className="absolute inset-0 bg-black backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* 드로어 패널 */}
            <motion.div
              ref={menuRef}
              className="absolute top-0 right-0 w-72 max-w-[85vw] h-full bg-white shadow-xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* 드로어 헤더 */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">메뉴</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 transition-colors"
                  aria-label="메뉴 닫기"
                >
                  <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 네비게이션 링크 */}
              <motion.nav
                className="flex-1 overflow-y-auto py-3"
                variants={staggerNavVariants}
                initial="hidden"
                animate="show"
              >
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                  return (
                    <StaggerItem key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center px-5 py-3 text-sm transition-colors ${
                          isActive
                            ? 'text-neutral-900 bg-neutral-50 font-medium border-r-2 border-neutral-900'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </StaggerItem>
                  );
                })}
              </motion.nav>

              {/* 인증 영역 */}
              <div className="border-t border-neutral-100 p-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      {user?.name}
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { openLoginModal(); setMobileOpen(false); }}
                      className="w-full py-2.5 text-sm text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      로그인
                    </button>
                    <Link
                      href="/register"
                      className="block w-full py-2.5 text-sm text-center text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      시작하기
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LoginModal />
    </>
  );
}
