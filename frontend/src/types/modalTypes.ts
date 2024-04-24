import { Dispatch, SetStateAction } from 'react';

export type OpenModalFunction = (modalTypeArg: ModalType) => void;
export type ToggleModalFunction = (modalTypeArg: ModalType) => void;

export type ModalType = 'confirm-password' | '';

export interface ModalContextItf {
  isOpen: boolean;
  modalType: ModalType;
  openModal: OpenModalFunction;
  closeModal: Dispatch<SetStateAction<void>>;
  toggleModal: ToggleModalFunction;
}
