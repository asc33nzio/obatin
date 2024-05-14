'use client';
import { useState, useEffect } from 'react';
import { ToastContextItf } from '@/types/toastTypes';
import ToastContext from '@/contexts/toastContext';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastState, setToastState] = useState<ToastContextItf>({
    showToast: false,
    toastMessage: '',
    toastType: 'ok',
    resolution: 'desktop',
    orientation: 'right',
    setToast: () => {},
  });

  const setToast: ToastContextItf['setToast'] = (newState) => {
    setToastState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (toastState.showToast) {
      timeoutId = setTimeout(() => {
        setToastState((prevState) => ({
          ...prevState,
          showToast: false,
        }));
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [toastState]);

  const { showToast, toastMessage, toastType, resolution, orientation } =
    toastState;

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toastMessage,
        toastType,
        resolution,
        orientation,
        setToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
