'use client';
import { useState } from 'react';
import { ModalContextItf } from '@/types/modalTypes';
import ModalContext from '@/contexts/modalContext';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<ModalContextItf>({
    isOpen: false,
    modalType: '',
    openModal: () => {},
    closeModal: () => {},
    toggleModal: () => {},
  });

  const openModal: ModalContextItf['openModal'] = (newState) => {
    setModalState((prevState) => ({
      ...prevState,
      ...newState,
      isOpen: true,
    }));
  };

  const closeModal: ModalContextItf['closeModal'] = () => {
    setModalState((prevState) => ({
      ...prevState,
      isOpen: false,
      modalType: '',
    }));
  };

  const toggleModal: ModalContextItf['toggleModal'] = (newState) => {
    setModalState((prevState) => ({
      ...prevState,
      ...newState,
      isOpen: !modalState.isOpen,
    }));
  };

  const { isOpen, modalType } = modalState;

  return (
    <ModalContext.Provider
      value={{ isOpen, modalType, openModal, closeModal, toggleModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
