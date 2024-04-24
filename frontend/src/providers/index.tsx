'use client';
import { Provider } from 'react-redux';
import { ClientDisplayResolutionProvider } from './ClientDisplayResolutionProvider';
import { PasswordValidationProvider } from './PasswordValidationProvider';
import { ModalProvider } from './ModalProvider';
import { ToastProvider } from './ToastProvider';
import { store } from '@/redux/store/store';
// import { PersistGate } from 'redux-persist/integration/react';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={<PropagateLoad />} persistor={persistor}> */}
      <ClientDisplayResolutionProvider>
        <ModalProvider>
          <ToastProvider>
            <PasswordValidationProvider>{children}</PasswordValidationProvider>
          </ToastProvider>
        </ModalProvider>
      </ClientDisplayResolutionProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}
