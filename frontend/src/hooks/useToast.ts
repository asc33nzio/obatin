import { useContext } from 'react';
import { ToastContextItf } from '@/types/toastTypes';
import ToastContext from '@/contexts/toastContext';

export const useToast = (): ToastContextItf => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('Toast context missing!');
  }

  return context;
};
