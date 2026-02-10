import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대시보드',
  description: '내 정보와 시뮬레이션 기록을 확인하세요.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
