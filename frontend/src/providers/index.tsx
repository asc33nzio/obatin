'use client';
import { ClientDisplayResolutionProvider } from './ClientDisplayResolutionProvider';
import { PasswordValidationProvider } from './PasswordValidationProvider';
import { ModalProvider } from './ModalProvider';
import { ToastProvider } from './ToastProvider';
import { NavbarProvider } from './NavbarProvider';
import ReduxProvider from './ReduxProvider';
import { EventEmitterProvider } from './EventEmitterProvider';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientDisplayResolutionProvider>
      <ReduxProvider>
        <EventEmitterProvider>
          <NavbarProvider>
            <ModalProvider>
              <ToastProvider>
                <PasswordValidationProvider>
                  {children}
                </PasswordValidationProvider>
              </ToastProvider>
            </ModalProvider>
          </NavbarProvider>
        </EventEmitterProvider>
      </ReduxProvider>
    </ClientDisplayResolutionProvider>
  );
}
