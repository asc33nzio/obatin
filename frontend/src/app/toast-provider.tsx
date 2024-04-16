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
  toastType: AcceptableToastType | string;
  resolution: AcceptableResolutionType | string;
  orientation?: AcceptableToastOrientation | string;
  setToast: Dispatch<
    SetStateAction<{
      showToast: boolean;
      toastMessage: string;
      toastType: string;
      resolution: string;
      orientation: string;
    }>
  >;
}

const ToastContext = createContext<ToastContextPropsItf | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState({
    showToast: false,
    toastMessage: '',
    toastType: '',
    resolution: 'desktop',
    orientation: 'center',
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (toast.showToast) {
      timeoutId = setTimeout(() => {
        setToast({
          showToast: false,
          toastMessage: '',
          toastType: '',
          resolution: 'desktop',
          orientation: '',
        });
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [toast]);

  // const value = {
  //   showToast: toast.showToast,
  //   toastMessage: toast.toastMessage,
  //   toastType: toast.toastType,
  //   resolution: toast.resolution,
  //   orientation: toast.orientation,
  //   setToast: (
  //     showToast: boolean,
  //     toastMessage: string,
  //     toastType: string,
  //     resolution: string,
  //     orientation: string,
  //   ) =>
  //     setToast({ showToast, toastMessage, toastType, resolution, orientation }),
  // };

  const { showToast, toastMessage, toastType, resolution, orientation } = toast;

  return (
    // <ToastContext.Provider value={value}>
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
