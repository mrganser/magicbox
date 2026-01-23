import type { Metadata } from 'next';
import { DM_Serif_Display, Outfit } from 'next/font/google';
import Script from 'next/script';
import { Navbar } from '@/components/layout/navbar';
import { SocketProvider } from '@/contexts/socket-context';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Magic Box',
  description: 'Real-time media sharing with your friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <body className={`${outfit.variable} ${dmSerif.variable}`}>
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
