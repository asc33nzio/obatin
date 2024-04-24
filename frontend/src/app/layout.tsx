import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientDisplayResolutionProvider } from '../providers/ClientDisplayResolutionProvider';
import { PasswordValidationProvider } from '@/providers/PasswordValidationProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import Toast from '@/components/organisms/toast/Toast';
import Modal from '@/components/organisms/modal/Modal';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

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
          <ModalProvider>
            <ToastProvider>
              <PasswordValidationProvider>
                {children}
                <Toast />
                <Modal />
              </PasswordValidationProvider>
            </ToastProvider>
          </ModalProvider>
        </ClientDisplayResolutionProvider>
      </body>
    </html>
  );
}
