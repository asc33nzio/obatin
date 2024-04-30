'use client';
import {
  ModalContainer,
  ModalOverlay,
  ModalHeader,
} from '@/styles/organisms/modal/Modal.styles';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import ChangePasswordModalContent from './modalContent/ChangePasswordModalContent';
import CloseICO from '@/assets/icons/CloseICO';
import RegisterConfirmPasswordModalContent from './modalContent/RegisterConfirmPasswordModalContent';
import AddAddressModalContent from './modalContent/AddAddressModalContent';

export interface ModalPropsItf {
  $overlayHeight?: string;
  $containerWidth: string;
  $containerHeight: string;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $bgColor?: string | undefined;
}

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const emitter = useEventEmitter();

  const handleModalClose = () => {
    emitter.emit('close-modal-fail');
    closeModal();
  };

  let modalContent: React.ReactElement | null;
  let title: string | null = null;
  let modalProps: ModalPropsItf = {
    $overlayHeight: '100vh',
    $containerWidth: '500px',
    $containerHeight: '500px',
    $fontSize: '18px',
    $color: '#4a5568',
    $bgColor: 'white',
  };

  switch (modalType) {
    case 'confirm-password':
      modalContent = <ChangePasswordModalContent />;
      title = 'Tolong konfirmasi sandi anda';
      modalProps = {
        $overlayHeight: '125vh',
        $containerWidth: '500px',
        $containerHeight: '250px',
      };
      break;

    case 'confirm-password-register':
      modalContent = <RegisterConfirmPasswordModalContent />;
      title = 'Tolong konfirmasi sandi anda';
      modalProps = {
        $overlayHeight: '100vh',
        $containerWidth: '500px',
        $containerHeight: '250px',
      };
      break;

    case 'add-address':
      modalContent = <AddAddressModalContent />;
      title = 'Tambahkan Alamat';
      modalProps = {
        $overlayHeight: '125vh',
        $containerWidth: '500px',
        $containerHeight: '500px',
      };
      break;

    default:
      modalContent = null;
      title = null;
      break;
  }

  return (
    isOpen && (
      <ModalOverlay {...modalProps}>
        <ModalContainer {...modalProps}>
          <ModalHeader>
            <h1>{title}</h1>
            <CloseICO onClick={handleModalClose} />
          </ModalHeader>
          {modalContent}
        </ModalContainer>
      </ModalOverlay>
    )
  );
};

export default Modal;
