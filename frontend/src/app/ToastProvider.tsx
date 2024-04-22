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

interface ToastContextItf {
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

const ToastContext = createContext<ToastContextItf | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastState, setToastState] = useState<ToastContextItf>({
    showToast: false,
    toastMessage: '',
    toastType: 'ok',
    resolution: 'desktop',
    orientation: 'center',
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
      }, 3000);
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

export const useToast = (): ToastContextItf => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('Toast context missing!');
  }

  return context;
};
