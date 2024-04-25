'use client';
import { ClientDisplayResolutionProvider } from './ClientDisplayResolutionProvider';
import { PasswordValidationProvider } from './PasswordValidationProvider';
import { ModalProvider } from './ModalProvider';
import { ToastProvider } from './ToastProvider';
import ReduxProvider from './ReduxProvider';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <ClientDisplayResolutionProvider>
        <ModalProvider>
          <ToastProvider>
            <PasswordValidationProvider>{children}</PasswordValidationProvider>
          </ToastProvider>
        </ModalProvider>
      </ClientDisplayResolutionProvider>
    </ReduxProvider>
  );
}
