import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SocketProvider } from '@/contexts/socket-context';
import { Navbar } from '@/components/layout/navbar';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Magic Box',
  description: 'Real-time media sharing with your friends',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
        </SocketProvider>
        {recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
