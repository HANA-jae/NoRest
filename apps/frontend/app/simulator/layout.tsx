import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '퇴사 시뮬레이터',
  description: '퇴직금, 실업급여, 생존 기간을 계산하고 퇴사 후 재정 상태를 시뮬레이션하세요.',
  keywords: ['퇴사 시뮬레이터', '퇴직금 계산', '실업급여', '생존 기간', '퇴사 계획'],
  openGraph: {
    title: '퇴사 시뮬레이터 - HAN',
    description: '퇴직금, 실업급여, 생존 기간 계산',
  },
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
