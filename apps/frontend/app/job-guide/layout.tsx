import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이직 가이드',
  description: '준비부터 퇴사까지 단계별 체크리스트로 이직을 체계적으로 관리하세요.',
  keywords: ['이직 가이드', '이직 체크리스트', '퇴사 준비', '이력서', '면접 준비'],
  openGraph: {
    title: '이직 가이드 - HAN',
    description: '단계별 이직 체크리스트',
  },
};

export default function JobGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
