'use client';
import { useState } from 'react';
import {
  ModalContextItf,
  ModalType,
  OpenModalFunction,
  ToggleModalFunction,
} from '@/types/modalTypes';
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

  const openModal: OpenModalFunction = (modalTypeArg: ModalType) => {
    setModalState({
      isOpen: true,
      modalType: modalTypeArg,
      openModal,
      closeModal,
      toggleModal,
    });
  };

  const closeModal: ModalContextItf['closeModal'] = () => {
    setModalState((prevState) => ({
      ...prevState,
      isOpen: false,
      modalType: '',
    }));
  };

  const toggleModal: ToggleModalFunction = (modalTypeArg: ModalType) => {
    setModalState({
      isOpen: !modalState.isOpen,
      modalType: modalTypeArg,
      openModal,
      closeModal,
      toggleModal,
    });
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
