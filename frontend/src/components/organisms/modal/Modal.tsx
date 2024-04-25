'use client';
import { useModal } from '@/hooks/useModal';
import {
  ModalContainer,
  ModalOverlay,
  ModalHeader,
} from '@/styles/organisms/modal/Modal.styles';
import ChangePasswordModalContent from './modalContent/ChangePasswordModalContent';
import CloseICO from '@/assets/icons/CloseICO';

export interface ModalPropsItf {
  $containerWidth: string;
  $containerHeight: string;
  $fontSize?: string | undefined;
  $color?: string | undefined;
  $bgColor?: string | undefined;
}

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();

  let modalContent: React.ReactElement | null;
  let title: string | null = null;
  let modalProps: ModalPropsItf = {
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
        $containerWidth: '500px',
        $containerHeight: '250px',
      };
      break;

    default:
      modalContent = null;
      title = null;
      break;
  }

  return (
    isOpen && (
      <ModalOverlay>
        <ModalContainer {...modalProps}>
          <ModalHeader>
            <h1>{title}</h1>
            <CloseICO onClick={closeModal} />
          </ModalHeader>
          {modalContent}
        </ModalContainer>
      </ModalOverlay>
    )
  );
};

export default Modal;
