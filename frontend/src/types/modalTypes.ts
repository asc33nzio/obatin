import { Dispatch, SetStateAction } from 'react';

export type OpenModalFunction = (modalTypeArg: ModalType) => void;
export type ToggleModalFunction = (modalTypeArg: ModalType) => void;
export interface ModalContextItf {
  isOpen: boolean;
  modalType: ModalType;
  openModal: OpenModalFunction;
  closeModal: Dispatch<SetStateAction<void>>;
  toggleModal: ToggleModalFunction;
}

export type ModalType =
  | 'confirm-password'
  | 'confirm-password-doctor'
  | 'confirm-password-register'
  | 'add-address'
  | 'doctor-detail'
  | 'update-address'
  | 'payment-upload'
  | 'select-address'
  | 'detail-pharmacy'
  | '';
