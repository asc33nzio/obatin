import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import StyledComponentsRegistry from '@/lib/registry';
import Toast from '@/components/organisms/toast/Toast';
import Modal from '@/components/organisms/modal/Modal';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Obatin',
  description: 'Obatin pharma',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Providers>
            {children}
            <Toast />
            <Modal />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
