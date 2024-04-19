import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/providers/ToastProvider';
import { ClientDisplayResolutionProvider } from '../providers/ClientDisplayResolutionProvider';
import Toast from '@/components/toast/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Obatin',
  description: 'Obatin pharma',
  manifest: '/site.webmanifest',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ClientDisplayResolutionProvider>
            <ToastProvider>
              {children}
              <Toast />
            </ToastProvider>
        </ClientDisplayResolutionProvider>
      </body>
    </html>
  );
}
