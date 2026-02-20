import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '퇴사각 테스트',
  description: '12개의 질문으로 나의 퇴사 필요도를 진단해보세요. 직장 생활 만족도와 퇴사 타이밍을 체크합니다.',
  keywords: ['퇴사각 테스트', '퇴사 심리테스트', '직장 만족도', '퇴사 진단', '이직 고민'],
  openGraph: {
    title: '퇴사각 테스트',
    description: '나의 퇴사 필요도 진단',
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
