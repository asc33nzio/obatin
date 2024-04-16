'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  AcceptableResolutionType,
  AcceptableToastOrientation,
  AcceptableToastType,
} from '@/types/toast';

interface ToastContextPropsItf {
  showToast: boolean;
  toastMessage: string;
  toastType: AcceptableToastType;
  resolution: AcceptableResolutionType;
  orientation: AcceptableToastOrientation;
  setToast: Dispatch<
    SetStateAction<{
      showToast: boolean;
      toastMessage: string;
      toastType: AcceptableToastType;
      resolution: AcceptableResolutionType;
      orientation: AcceptableToastOrientation;
    }>
  >;
}

const ToastContext = createContext<ToastContextPropsItf | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastContextPropsItf>({
    showToast: false,
    toastMessage: '',
    toastType: 'ok',
    resolution: 'desktop',
    orientation: 'center',
    setToast: (newToast) =>
      setToast((prevToast) => ({ ...prevToast, ...newToast })),
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (toast.showToast) {
      timeoutId = setTimeout(() => {
        setToast((prevState) => ({
          ...prevState,
          showToast: false,
        }));
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [toast]);

  const { showToast, toastMessage, toastType, resolution, orientation } = toast;

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

export const useToast = (): ToastContextPropsItf => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('Toast context missing!');
  }

  return context;
};
