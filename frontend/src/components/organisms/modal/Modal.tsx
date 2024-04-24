'use client';
import { useModal } from '@/hooks/useModal';
import {
  ModalContainer,
  ModalOverlay,
  ModalHeader,
} from '@/styles/organisms/modal/Modal.styles';
import ChangePasswordModalContent from './modalContent/ChangePasswordModalContent';
import CloseICO from '@/assets/icons/CloseICO';

// export interface ModalPropsItf {
//   $fontSize?: string | undefined;
//   $color?: string | undefined;
//   $bgColor?: string | undefined;
//   disabled?: boolean | undefined;
// }

const Modal = () => {
  const { isOpen, modalType, closeModal } = useModal();

  let modalContent: React.ReactElement | null;
  let title: string | null = null;
  let $width: string = '0px';
  let $height: string = '0px';

  //? add a new case for your modal
  switch (modalType) {
    case 'confirm-password':
      modalContent = <ChangePasswordModalContent />;
      title = 'Tolong konfirmasi sandi anda';
      $width = '500px';
      $height = '200px';
      break;

    default:
      modalContent = null;
      title = null;
      $width = '0px';
      $height = '0px';
      break;
  }

  return (
    isOpen && (
      <ModalOverlay>
        <ModalContainer $width={$width} $height={$height}>
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
