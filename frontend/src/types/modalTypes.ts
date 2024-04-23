import { Dispatch, SetStateAction } from 'react';

type modalType = 'confirm-password' | '';

export interface ModalContextItf {
  isOpen: boolean;
  modalType: string;
  openModal: Dispatch<
    SetStateAction<{
      modalType: modalType;
    }>
  >;
  closeModal: Dispatch<SetStateAction<null>>;
  toggleModal: Dispatch<
    SetStateAction<{
      modalType: modalType;
    }>
  >;
}
