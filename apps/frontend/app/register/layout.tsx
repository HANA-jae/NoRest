import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입',
  description: 'HAN에 가입하고 퇴사, 이직, 연봉 계산 도구를 이용하세요.',
  openGraph: {
    title: '회원가입 - HAN',
    description: 'HAN 서비스 회원가입',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
