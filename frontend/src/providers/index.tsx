'use client';
import { ClientDisplayResolutionProvider } from './ClientDisplayResolutionProvider';
import { PasswordValidationProvider } from './PasswordValidationProvider';
import { ModalProvider } from './ModalProvider';
import { ToastProvider } from './ToastProvider';
import { NavbarProvider } from './NavbarProvider';
import { EventEmitterProvider } from './EventEmitterProvider';
import { PrimeReactProvider } from 'primereact/api';
import ReduxProvider from './ReduxProvider';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientDisplayResolutionProvider>
      <ReduxProvider>
        <EventEmitterProvider>
          <PrimeReactProvider>
            <NavbarProvider>
              <ModalProvider>
                <ToastProvider>
                  <PasswordValidationProvider>
                    {children}
                  </PasswordValidationProvider>
                </ToastProvider>
              </ModalProvider>
            </NavbarProvider>
          </PrimeReactProvider>
        </EventEmitterProvider>
      </ReduxProvider>
    </ClientDisplayResolutionProvider>
  );
}
