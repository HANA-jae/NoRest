import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '복잡한 마음, 명확한 숫자로',
    template: '%s - HAN',
  },
  description: '퇴직금, 실업급여, 4대보험, 연봉 계산을 정확하고 빠르게. 복잡한 마음, 명확한 숫자로.',
  keywords: ['퇴사', '이직', '퇴직금 계산', '실업급여', '연봉 계산기', '4대보험', '퇴직연금'],
  authors: [{ name: 'HAN' }],
  openGraph: {
    title: '복잡한 마음, 명확한 숫자로',
    description: '퇴사, 이직, 연봉 협상에 필요한 모든 계산을 정확하고 빠르게.',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-neutral-900 antialiased flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
