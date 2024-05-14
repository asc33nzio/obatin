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
  | 'select-address'
  | 'view-more-tx'
  | 'add-shipping'
  | 'unset-shipment'
  | 'confirm-checkout'
  | 'select-nearby-pharmacy'
  | 'confirm-receive-order'
  | 'confirm-cancel-order'
  | '';

export type InvokableModalType = 'pharmacy-detail' | 'doctor-detail';
