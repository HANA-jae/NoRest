import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '연봉 계산기',
  description: '4대보험과 소득세를 제외한 실수령액을 계산하세요. 연봉과 월급 모두 계산 가능합니다.',
  keywords: ['연봉 계산기', '실수령액', '4대보험', '소득세', '월급 계산'],
  openGraph: {
    title: '연봉 계산기 - HAN',
    description: '4대보험, 소득세, 실수령액 계산',
  },
};

export default function SalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
