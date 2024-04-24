import { useContext } from 'react';
import { ModalContextItf } from '@/types/modalTypes';
import ModalContext from '@/contexts/modalContext';

export const useModal = (): ModalContextItf => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal context missing!');
  }

  return context;
};
