import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '퇴직연금 계산기',
  description: 'DB형과 DC형 퇴직연금을 비교 분석하세요. 예상 수령액과 최적의 선택을 확인합니다.',
  keywords: ['퇴직연금', 'DB형', 'DC형', '확정급여', '확정기여', '연금 계산'],
  openGraph: {
    title: '퇴직연금 계산기 - HAN',
    description: 'DB형 vs DC형 비교 분석',
  },
};

export default function PensionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
